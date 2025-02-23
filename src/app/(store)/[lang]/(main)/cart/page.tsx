"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore from "@/store/store";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full lg:w-80" />
          </div>
        </div>
      </div>
    );
  }

  if (groupedItems.length === 0) {
    return <EmptyCart />;
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = groupedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Shopping Cart
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div layout className="flex-grow">
          <AnimatePresence mode="popLayout">
            {groupedItems.map((item) => (
              <CartItem
                key={item.product._id}
                product={item.product}
                quantity={item.quantity}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <CartSummary
          isLoading={isLoading}
          onCheckout={handleCheckout}
          itemCount={itemCount}
        />
      </div>

      {/* Spacer for mobile layout */}
      <div className="h-32 lg:h-0" />
    </div>
  );
}
