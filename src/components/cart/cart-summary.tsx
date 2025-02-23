"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/store";

interface CartSummaryProps {
  isLoading: boolean;
  onCheckout: () => void;
  itemCount: number;
}

export function CartSummary({
  isLoading,
  onCheckout,
  itemCount,
}: CartSummaryProps) {
  const totalPrice = useCartStore.getState().getTotalPrice();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full lg:w-80 lg:sticky lg:top-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>EUR {totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading}
            onClick={onCheckout}
          >
            {isLoading ? "Processing..." : "Checkout"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
