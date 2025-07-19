"use server";

export async function initiateMpesaPayment(phone: string, amount: number): Promise<{ success: boolean; error?: string }> {
  console.log(`Initiating M-Pesa payment for ${phone} with amount ${amount}`);

  // This is a simulation. In a real application, you would:
  // 1. Get an OAuth token from Daraja API.
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
