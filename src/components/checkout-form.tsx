"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { initiateMpesaPayment } from "@/app/actions";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const phoneRegex = new RegExp(
  /^254(7\d{8}|1\d{8})$/
);

const checkoutSchema = z.object({
  phone: z.string().regex(phoneRegex, "Must be a valid Safaricom number (e.g., 254712345678)"),
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
              <FormLabel>M-Pesa Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="254712345678" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)} with M-Pesa`}
        </Button>
      </form>
    </Form>
  );
}
