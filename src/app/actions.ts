"use server";

import "dotenv/config";

export async function initiateMpesaPayment(phone: string, amount: number): Promise<{ success: boolean; error?: string }> {
  console.log(`Initiating M-Pesa payment for ${phone} with amount ${amount}`);

  // In a real application, you would use these environment variables
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const shortCode = process.env.DARAJA_BUSINESS_SHORT_CODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const callbackURL = process.env.DARAJA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortCode || !passkey || !callbackURL) {
    console.error("Daraja credentials are not set in the environment variables.");
    return { success: false, error: "Server configuration error. Please contact support." };
  }

  // This is a simulation. In a real application, you would:
  // 1. Get an OAuth token from Daraja API using consumerKey and consumerSecret.
  // 2. Make a POST request to the STK Push endpoint with the phone, amount, and other details.
  // 3. Handle the response from Safaricom.

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simulate a random success/failure outcome
  if (Math.random() > 0.2) { // 80% success rate
    console.log("Simulated payment success.");
    // In a real app, the success is confirmed via a callback, not the initial response.
    // This simulation assumes the push was successfully initiated and the user paid.
    return { success: true };
  } else {
    console.log("Simulated payment failure.");
    return { success: false, error: "The payment could not be processed. Please try again." };
  }
}
