"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import useCartStore from "@/store/store";

interface CartItemProps {
  product: any;
  quantity: number;
}

export function CartItem({ product, quantity }: CartItemProps) {
  const router = useRouter();
  const removeFromCart = useCartStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-4 mb-4 rounded-none  border-b-2 shadow-none">
        <div className="flex items-center gap-4">
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/product/${product.slug?.current}`)}
          >
            {product.images && (
              <Image
                src={urlFor(product.images[0]).url() || "/placeholder.svg"}
                alt={product.name ?? "Product Image"}
                className="object-cover"
                width={120}
                height={120}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold truncate cursor-pointer hover:text-primary"
              onClick={() => router.push(`/product/${product.slug?.current}`)}
            >
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              EUR {product.eurprice?.toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              EUR {(product.eurprice * quantity).toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive mt-2"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  removeFromCart(product._id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
