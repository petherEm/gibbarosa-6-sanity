"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";

const getDescriptionByLang = (product: Product, lang: string) => {
  switch (lang) {
    case "pl":
      return product.PLdescription;
    case "fr":
      return product.FRdescription;
    case "en":
      return product.ENdescription;
    default:
      return product.ENdescription;
  }
};

const getPriceByLang = (product: Product, lang: string) => {
  switch (lang) {
    case "pl":
      return { price: product.plnprice, currency: "PLN" };
    default:
      return { price: product.eurprice, currency: "EUR" };
  }
};

const ProductThumb = ({
  product,
  lang,
}: {
  product: Product;
  lang: string;
}) => {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  const [isHovered, setIsHovered] = useState(false);
  const description = getDescriptionByLang(product, lang);
  const { price, currency } = getPriceByLang(product, lang);

  return (
    <Link
      href={`/${lang}/product/${product.slug?.current}`}
      className={`group flex flex-col bg-white transition-all duration-200 overflow-hidden w-full max-w-[300px] cursor-pointer mx-auto ${
        isOutOfStock ? "opacity-75 grayscale" : ""
      }`}
    >
      <div
        className="relative w-full aspect-[4/5] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.images && (
          <>
            <Image
              className={`object-contain transition-opacity duration-300 absolute inset-0 p-2 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
              src={urlFor(product.images[0]).url() || ""}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
            <Image
              className={`object-contain transition-opacity duration-300 absolute inset-0 p-2 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={urlFor(product.images[1]).url() || ""}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          </>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 right-4 bg-black text-white px-3 py-1 rounded-full font-semibold text-sm shadow-lg">
            Sold
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
          Brand name
        </h2>
        <h2 className="text-base sm:text-lg font-normal text-gray-800 truncate mt-0.5">
          {product.name}
        </h2>
        <p className="mt-2 text-sm sm:text-md font-semibold text-gray-900">
          {currency} {price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductThumb;
