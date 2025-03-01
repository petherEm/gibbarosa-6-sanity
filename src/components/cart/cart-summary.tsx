"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard } from "lucide-react";

interface CartSummaryProps {
  isLoading?: boolean;
  onCheckout: () => void;
  itemCount: number;
  totalPrice: number;
  currency: string;
  lang: string;
}

export function CartSummary({
  isLoading = false,
  onCheckout,
  itemCount,
  totalPrice,
  currency = "€",
  lang = "en",
}: CartSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg space-y-6 sticky top-24 h-fit lg:min-w-72"
    >
      <h2 className="font-bold text-lg">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
          <span>
            {currency} {totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            {currency} {totalPrice.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Taxes included. Shipping calculated at checkout.
        </p>
      </div>
      <Button className="w-full" onClick={onCheckout} disabled={isLoading}>
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" /> Checkout
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-4">
        We offer free shipping on all European orders. Delivery time is
        typically 3-5 business days.
      </p>
    </motion.div>
  );
}
