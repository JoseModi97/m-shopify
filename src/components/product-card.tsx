"use client";

import Image from "next/image";
import { Plus, Minus, PlusCircle, Star } from "lucide-react";
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
import { useState } from "react";
import { Input } from "./ui/input";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
        title: "Added to cart",
        description: `${quantity} x "${product.title}" has been added to your cart.`,
    });
    setQuantity(1); // Reset quantity after adding
    setIsDialogOpen(false); // Close dialog after adding
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setQuantity(1); // Reset quantity when dialog is closed
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
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
          <Button className="w-full" onClick={() => {
            addToCart(product, 1);
            toast({
              title: "Added to cart",
              description: `"${product.title}" has been added to your cart.`,
            });
          }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[650px] grid md:grid-cols-2 gap-8 items-start">
        <div className="relative h-96 w-full md:h-full">
           <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 rounded-md"
            data-ai-hint="product image"
          />
        </div>
        <div className="flex flex-col space-y-4 h-full">
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
          <div className="text-muted-foreground text-sm flex-grow overflow-y-auto max-h-32 pr-2">
              <p>{product.description}</p>
          </div>
          <DialogFooter className="sm:justify-start flex-col items-stretch gap-4 mt-auto">
             <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-foreground">
                    KES {(product.price * quantity).toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(quantity - 1)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                        type="number"
                        className="h-8 w-14 text-center"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                        min="1"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(quantity + 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
             </div>
            <Button size="lg" onClick={handleAddToCart}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
