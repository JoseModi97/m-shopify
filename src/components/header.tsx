"use client";

import { ShoppingCart, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart";
import { useCart } from "@/context/cart-context";

export function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Store className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg font-headline">M-Shopify</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full flex items-center justify-center bg-primary text-primary-foreground"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <Cart />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
