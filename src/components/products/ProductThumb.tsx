"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";

const getNameByLang = (product, lang) => {
  const langKey = lang.toUpperCase();
  return product.name?.[langKey] || product.name?.EN || "";
};

const getPriceByLang = (product, lang) => {
  if (!product.pricing) return { price: 0, currency: "EUR" };

  switch (lang) {
    case "pl":
      return {
        price: product.pricing.PLN || 0,
        currency: "PLN",
        estimatedRetailPrice: product.pricing.PLNestimatedRetailPrice,
      };
    default:
      return {
        price: product.pricing.EUR || 0,
        currency: "EUR",
        estimatedRetailPrice: product.pricing.EURestimatedRetailPrice,
      };
  }
};

const getBrandName = (product, lang) => {
  if (!product.brands || !product.brands.length) return "";

  const langKey = lang.toUpperCase();
  const brand = product.brands[0];
  return brand.title?.[langKey] || brand.title?.EN || "";
};

const ProductThumb = ({ product, lang }) => {
  const isOutOfStock = product.inStock === false;
  const [isHovered, setIsHovered] = useState(false);
  const productName = getNameByLang(product, lang);
  const { price, currency } = getPriceByLang(product, lang);
  const brandName = getBrandName(product, lang);

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
        {product.images && product.images.length > 0 ? (
          <>
            <Image
              className={`object-contain transition-opacity duration-300 absolute inset-0 p-2 ${
                isHovered && product.images.length > 1
                  ? "opacity-0"
                  : "opacity-100"
              }`}
              src={urlFor(product.images[0]).url()}
              alt={productName || "Product Image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
            {product.images.length > 1 && (
              <Image
                className={`object-contain transition-opacity duration-300 absolute inset-0 p-2 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                src={urlFor(product.images[1]).url()}
                alt={productName || "Product Image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 right-4 bg-black text-white px-3 py-1 rounded-full font-semibold text-sm shadow-lg">
            Sold
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
          {brandName || "Brand"}
        </h2>
        <h2 className="text-base sm:text-lg font-normal text-gray-800 truncate mt-0.5">
          {productName || "Product Name"}
        </h2>
        <p className="mt-2 text-sm sm:text-md font-semibold text-gray-900">
          {currency} {price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductThumb;
