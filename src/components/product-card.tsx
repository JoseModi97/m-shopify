"use client";

import Image from "next/image";
import { PlusCircle } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
        title: "Added to cart",
        description: `"${product.title}" has been added to your cart.`,
    });
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4"
            data-ai-hint="product image"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-base font-medium font-headline leading-snug truncate h-12">
          {product.title}
        </CardTitle>
        <CardDescription className="mt-2 text-lg font-semibold text-foreground">
          KES {product.price.toFixed(2)}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
