"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmptyCart() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
    >
      <div className="rounded-full bg-muted p-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      <p className="text-muted-foreground">
        Start shopping to add items to your cart
      </p>
      <Button onClick={() => router.push("/products")}>Browse Products</Button>
    </motion.div>
  );
}
