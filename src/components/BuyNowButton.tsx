"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../sanity.types";
import useCartStore from "../store/store";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  product: Product;
  disabled?: boolean;
}

const BuyNowButton = ({ product, disabled }: BuyNowButtonProps) => {
  const { addItem } = useCartStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBuyNow = async () => {
    setIsLoading(true);
    // Add item to cart
    addItem(product);
    // Simulate minimal delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Redirect to cart
    router.push("/cart");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleBuyNow}
        disabled={disabled || isLoading}
        variant="outline"
        className="w-full h-12 text-base rounded-full"
      >
        {isLoading ? (
          "Redirecting..."
        ) : (
          <>
            Buy now
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
      {disabled && (
        <p className="text-sm text-muted-foreground text-center">
          This item is currently out of stock
        </p>
      )}
    </div>
  );
};

export default BuyNowButton;
