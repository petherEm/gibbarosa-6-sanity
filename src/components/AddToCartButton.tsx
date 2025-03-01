"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle } from "lucide-react";
import useCartStore from "@/store/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AddToCartButtonProps {
  product: any;
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  // Check if the product is already in the cart
  const isInCart = cartItems.some((item) => item.product._id === product._id);

  const handleAddToCart = () => {
    if (isInCart) {
      setMessage("Already in cart");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    setIsAdding(true);

    // Ensure product has all required fields
    if (!product._id || !product.name || !product.pricing) {
      console.error("Invalid product structure:", product);
      setMessage("Error adding to cart");
      setIsAdding(false);
      return;
    }

    // Add to cart with quantity fixed at 1
    addToCart(product, 1);

    setMessage("Added to cart");
    setTimeout(() => {
      setMessage("");
      setIsAdding(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          className="flex-1"
          disabled={disabled || isAdding || isInCart}
          onClick={handleAddToCart}
          variant={isInCart ? "outline" : "default"}
        >
          {isAdding ? (
            message || "Adding..."
          ) : disabled ? (
            "Out of Stock"
          ) : isInCart ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> In Cart
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
