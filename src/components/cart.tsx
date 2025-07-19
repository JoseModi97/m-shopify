"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { useState } from "react";

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [paymentState, setPaymentState] = useState<'idle' | 'success'>('idle');

  const onPaymentSuccess = () => {
    setPaymentState('success');
  }

  if (paymentState === 'success') {
    return (
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
            <SheetHeader className="px-4">
                <SheetTitle className="font-headline">Payment Successful!</SheetTitle>
                <SheetDescription>
                    Your order has been placed. You will receive a confirmation shortly.
                </SheetDescription>
            </SheetHeader>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p className="mt-4 text-lg">Thank you for your purchase!</p>
            </div>
        </SheetContent>
    )
  }

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-4">
        <SheetTitle className="font-headline">Your Cart ({cartCount})</SheetTitle>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 p-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      KES {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <p className="font-semibold text-sm">
                        KES {(item.price * item.quantity).toFixed(2)}
                     </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="p-4 bg-secondary/50 rounded-b-lg">
            <div className="w-full space-y-4">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>KES {cartTotal.toFixed(2)}</span>
                </div>
                <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      )}
    </SheetContent>
  );
}
