"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../sanity.types";
import useCartStore from "../store/store";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

const AddToCartButton = ({ product, disabled }: AddToCartButtonProps) => {
  const { addItem } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    addItem(product);

    setIsLoading(false);
    setIsAdded(true);

    // Reset added state after animation
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isLoading}
        className={cn(
          "w-full h-12 text-base transition-all duration-200 rounded-full",
          isAdded && "bg-green-500 hover:bg-green-600"
        )}
      >
        <ShoppingCart
          className={cn(
            "mr-2 h-5 w-5 transition-transform duration-200",
            isAdded && "animate-bounce"
          )}
        />
        {isLoading ? "Adding..." : isAdded ? "Added to cart!" : "Add to cart"}
      </Button>
      {disabled && (
        <p className="text-sm text-muted-foreground text-center">
          This item is currently out of stock
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;
