"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import PaymentForm from "./PaymentForm";

// Helper function to get language-specific content
const getNameByLang = (product, lang) => {
  if (!product?.name) return "Product";

  const langKey = lang.toUpperCase();
  return product.name[langKey] || product.name.EN || "Product";
};

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface OrderSummaryProps {
  clientSecret: string | null;
  shippingData: any | null;
  shippingMethod: string | null;
  cartItems: any[];
  totalPrice: number;
  currency: string;
  lang: string;
}

export default function OrderSummary({
  clientSecret,
  shippingData,
  shippingMethod,
  cartItems,
  totalPrice,
  currency,
  lang,
}: OrderSummaryProps) {
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(totalPrice);

  useEffect(() => {
    // Calculate shipping cost based on method
    const shipping = shippingMethod === "express" ? 15 : 0;
    setShippingCost(shipping);
    setTotal(totalPrice + shipping);
  }, [shippingMethod, totalPrice]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const productName = getNameByLang(item.product, lang);
          const productPrice =
            currency === "PLN"
              ? Number(item.product.pricing?.PLN || 0)
              : Number(item.product.pricing?.EUR || 0);

          return (
            <div key={item.product._id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                {item.product.images && item.product.images.length > 0 ? (
                  <Image
                    src={urlFor(item.product.images[0]).url()}
                    alt={productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{productName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {currency} {productPrice.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>
            {currency} {totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {shippingCost === 0
              ? "Free"
              : `${currency} ${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>
            {currency} {total.toFixed(2)}
          </span>
        </div>
      </div>

      {shippingData && clientSecret && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Payment</h3>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0A2540",
                },
              },
            }}
          >
            <PaymentForm
              amount={total}
              currency={currency}
              shippingDetails={shippingData}
            />
          </Elements>
        </div>
      )}

      {shippingData && !clientSecret && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
