"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore from "@/store/store";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  // Always call hooks at the top level
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate values that depend on state but aren't state themselves
  const itemCount = items.length;
  const totalPrice = getTotalPrice(lang);
  const currency = lang === "pl" ? "PLN" : "€";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug cart items when they change
  useEffect(() => {
    if (items.length > 0) {
      console.log("Cart items:", items);
    }
  }, [items]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      router.push(`/${lang}/checkout`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Early returns
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

  if (items.length === 0) {
    return <EmptyCart lang={lang} />;
  }

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
            {items.map((item) => (
              <CartItem
                key={item.product._id}
                product={item.product}
                quantity={item.quantity}
                lang={lang}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <CartSummary
          isLoading={isLoading}
          onCheckout={handleCheckout}
          itemCount={itemCount}
          totalPrice={totalPrice}
          currency={currency}
          lang={lang}
        />
      </div>

      {/* Spacer for mobile layout */}
      <div className="h-32 lg:h-0" />
    </div>
  );
}
