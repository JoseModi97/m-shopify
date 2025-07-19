"use server";

import "dotenv/config";
import { format } from 'date-fns';

// Helper function to get Daraja API access token
async function getDarajaToken(consumerKey: string, consumerSecret: string): Promise<string | null> {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = "Basic " + Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": auth,
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to get Daraja token:", response.status, errorText);
        return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching Daraja token:", error);
    return null;
  }
}

export async function initiateMpesaPayment(phone: string, amount: number): Promise<{ success: boolean; error?: string }> {
  console.log(`Initiating real M-Pesa payment for ${phone} with amount ${amount}`);

  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const shortCode = process.env.DARAJA_BUSINESS_SHORT_CODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const callbackURL = process.env.DARAJA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortCode || !passkey || !callbackURL) {
    console.error("Daraja credentials are not set in the environment variables.");
    return { success: false, error: "Server configuration error. Please contact support." };
  }

  const token = await getDarajaToken(consumerKey, consumerSecret);

  if (!token) {
    return { success: false, error: "Could not authenticate with payment provider. Please try again later." };
  }
  
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');
  const roundedAmount = Math.round(amount);

  const requestBody = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: roundedAmount,
    PartyA: phone,
    PartyB: shortCode,
    PhoneNumber: phone,
    CallBackURL: callbackURL,
    AccountReference: "M-Shopify",
    TransactionDesc: `Payment for order worth KES ${roundedAmount}`,
  };

  try {
    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (response.ok && result.ResponseCode === '0') {
      console.log("STK Push initiated successfully:", result);
      // The actual success is asynchronous and comes via the callback URL.
      // For the user, a successful initiation is what matters at this stage.
      return { success: true };
    } else {
      console.error("STK Push initiation failed:", result);
      const errorMessage = result.errorMessage || "The payment could not be processed. Please try again.";
      return { success: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error("An error occurred during STK Push request:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}