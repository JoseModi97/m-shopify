"use client";

import Image from "next/image";
import { PlusCircle, Star } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";

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
    <Dialog>
      <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <DialogTrigger asChild>
          <div className="cursor-pointer">
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
          </div>
        </DialogTrigger>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleAddToCart}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[600px] grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full md:h-full">
           <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 rounded-md"
            data-ai-hint="product image"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-headline">{product.title}</DialogTitle>
          </DialogHeader>
          <div>
            <Badge variant="secondary" className="capitalize">{product.category}</Badge>
            <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">{product.rating.rate}</span>
                <span className="text-sm text-muted-foreground">({product.rating.count} ratings)</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm flex-grow overflow-auto max-h-48">
              {product.description}
          </p>
          <DialogFooter className="sm:justify-start flex-col items-stretch gap-4">
             <p className="text-3xl font-bold text-foreground">
                KES {product.price.toFixed(2)}
             </p>
            <Button size="lg" onClick={handleAddToCart}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}