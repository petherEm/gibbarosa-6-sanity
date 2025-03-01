"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle } from "lucide-react";
import useCartStore from "@/store/store";
import { useState } from "react";

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

  // Check if the product is already in the cart
  const isInCart = cartItems.some((item) => item.product._id === product._id);

  // Check if product is in stock - just use the boolean flag
  const isOutOfStock = product.inStock === false;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setMessage("Out of stock");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    if (isInCart) {
      setMessage("Already in cart");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    setIsAdding(true);

    // Add to cart
    addToCart(product, 1);

    setMessage("Added to cart");
    setTimeout(() => {
      setMessage("");
      setIsAdding(false);
    }, 2000);
  };

  return (
    <Button
      className="w-full"
      disabled={disabled || isAdding || isInCart || isOutOfStock}
      onClick={handleAddToCart}
      variant={isInCart ? "outline" : isOutOfStock ? "secondary" : "default"}
    >
      {isAdding ? (
        message || "Adding..."
      ) : isOutOfStock ? (
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
  );
}
