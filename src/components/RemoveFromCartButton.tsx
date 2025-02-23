"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../sanity.types";
import useCartStore from "../store/store";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemoveFromCartButtonProps {
  product: Product;
  disabled?: boolean;
}

const RemoveFromCartButton = ({
  product,
  disabled,
}: RemoveFromCartButtonProps) => {
  const { removeItem } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    removeItem(product._id);

    setIsLoading(false);
    setIsRemoved(true);

    // Reset removed state after animation
    setTimeout(() => {
      setIsRemoved(false);
    }, 1500);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleRemoveFromCart}
        disabled={disabled || isLoading}
        variant="ghost"
        className={cn(
          "w-full h-12 text-base transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:border-red-200",
          isRemoved && "bg-red-100 text-red-600 border-red-200",
          "group"
        )}
      >
        <Trash2
          className={cn(
            "h-5 w-5 transition-transform duration-200 group-hover:text-red-600",
            isRemoved && "animate-bounce text-red-600"
          )}
        />
        {isLoading ? "Removing..." : isRemoved ? "Removed!" : ""}
      </Button>
    </div>
  );
};

export default RemoveFromCartButton;
