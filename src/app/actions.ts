"use server";

import "dotenv/config";
import { format } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

// Helper function to log messages to a file
async function logTransaction(logMessage: string) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });
    const logFile = path.join(logDir, 'mpesa-transactions.log');
    const timestamp = new Date().toISOString();
    await fs.appendFile(logFile, `${timestamp} - ${logMessage}\n`);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

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
      cache: 'no-cache',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to get Daraja token:", response.status, errorText);
        await logTransaction(`ERROR: Failed to get Daraja token. Status: ${response.status}, Body: ${errorText}`);
        return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching Daraja token:", error);
    await logTransaction(`ERROR: Exception fetching Daraja token: ${error}`);
    return null;
  }
}

export async function initiateMpesaPayment(phone: string, amount: number): Promise<{ success: boolean; error?: string }> {
  await logTransaction(`Attempting payment for Phone: ${phone}, Amount: ${amount}`);

  // M-Pesa requires the phone number without the leading '+'
  const formattedPhone = phone.startsWith('+') ? phone.substring(1) : phone;

  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const shortCode = process.env.DARAJA_BUSINESS_SHORT_CODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const callbackURL = process.env.DARAJA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortCode || !passkey || !callbackURL) {
    const errorMessage = "Daraja credentials are not set in the environment variables.";
    console.error(errorMessage);
    await logTransaction(`ERROR: ${errorMessage}`);
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
    PartyA: formattedPhone,
    PartyB: shortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackURL,
    AccountReference: "M-Shopify",
    TransactionDesc: `Payment for order worth KES ${roundedAmount}`,
  };

  try {
    await logTransaction(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);
    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    await logTransaction(`Response Body: ${JSON.stringify(result, null, 2)}`);

    if (response.ok && result.ResponseCode === '0') {
      console.log("STK Push initiated successfully:", result);
      await logTransaction(`SUCCESS: STK Push for ${phone} initiated successfully.`);
      return { success: true };
    } else {
      console.error("STK Push initiation failed:", result);
      const errorMessage = result.errorMessage || "The payment could not be processed. Please try again.";
      await logTransaction(`FAILURE: STK Push for ${phone} failed. Reason: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  } catch (error: any) {
    console.error("An error occurred during STK Push request:", error);
    await logTransaction(`FATAL: An exception occurred during STK Push for ${phone}. Error: ${error.message}`);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
