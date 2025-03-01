"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/store";
import { urlFor } from "@/sanity/lib/image";

interface CartItemProps {
  product: any;
  quantity: number;
  lang: string;
}

// Helper function to get language-specific content
const getNameByLang = (product, lang) => {
  if (!product?.name) return "Product";

  const langKey = lang.toUpperCase();
  return product.name[langKey] || product.name.EN || "Product";
};

// Helper function to get price based on language
const getPriceByLang = (product, lang) => {
  if (!product?.pricing) return { price: 0, currency: "€" };

  switch (lang) {
    case "pl":
      return {
        price: Number(product.pricing.PLN || 0),
        currency: "PLN",
      };
    default:
      return {
        price: Number(product.pricing.EUR || 0),
        currency: "€",
      };
  }
};

export function CartItem({ product, quantity, lang }: CartItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeItem = useCartStore((state) => state.removeItem);

  // Get product name in correct language
  const productName = getNameByLang(product, lang);

  // Get price and currency in correct language
  const { price, currency } = getPriceByLang(product, lang);

  const handleRemove = () => {
    setIsDeleting(true);
    setTimeout(() => {
      removeItem(product._id);
    }, 300);
  };

  // Get brand name if available
  const brandName =
    product.brands && product.brands.length > 0
      ? product.brands[0].title?.[lang.toUpperCase()] ||
        product.brands[0].title?.EN ||
        product.brands[0].name ||
        ""
      : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-b py-5 ${isDeleting ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
          <Link href={`/${lang}/product/${product.slug.current}`}>
            <Image
              src={
                product.images && product.images.length > 0
                  ? urlFor(product.images[0]).url()
                  : "/placeholder.svg"
              }
              alt={productName}
              fill
              className="object-cover"
            />
          </Link>
        </div>
        <div className="flex-grow space-y-1">
          {brandName && (
            <p className="text-sm text-muted-foreground">{brandName}</p>
          )}
          <Link href={`/${lang}/product/${product.slug.current}`}>
            <h3 className="font-medium hover:underline">{productName}</h3>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span>Exclusive design</span>
          </div>
        </div>
        <div className="space-y-2 text-right min-w-24">
          <div className="font-medium">
            {currency} {price.toFixed(2)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleRemove}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
