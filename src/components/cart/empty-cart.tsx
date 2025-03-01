"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmptyCartProps {
  lang?: string;
}

export function EmptyCart({ lang = "en" }: EmptyCartProps) {
  return (
    <div className="container mx-auto p-4 max-w-6xl h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center max-w-md space-y-8">
        <div className="rounded-full bg-gray-100 p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-gray-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild className="mt-4">
            <Link href={`/${lang}`}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
