"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { initiateMpesaPayment } from "@/app/actions";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PhoneInput, parsePhoneNumber } from "react-international-phone";
import "react-international-phone/style.css";

const checkoutSchema = z.object({
  phone: z.string().refine((phone) => {
    try {
        // The Mpesa API will do the final validation.
        return parsePhoneNumber(phone).isValid;
    } catch {
        return false
    }
  }, "Please enter a valid phone number."),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
    onPaymentSuccess: () => void;
}

export function CheckoutForm({ onPaymentSuccess }: CheckoutFormProps) {
  const { cartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: "",
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    setIsLoading(true);
    toast({
        title: "Processing Payment",
        description: "Please wait while we initiate the M-Pesa transaction. You may receive a prompt on your phone.",
    });
    try {
      const result = await initiateMpesaPayment(data.phone, cartTotal);
      if (result.success) {
        onPaymentSuccess();
        clearCart();
      } else {
        throw new Error(result.error || "Payment failed. Please try again.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  defaultCountry="ke"
                  inputClassName="!w-full"
                  className="w-full"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                M-Pesa payments are available for supported countries.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading || cartTotal === 0}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing...' : `Pay KES ${cartTotal.toFixed(2)} with M-Pesa`}
        </Button>
      </form>
    </Form>
  );
}
