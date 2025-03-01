"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ShippingAddressForm from "./ShippingAddressForm";
import OrderSummary from "@/components/OrderSummary";
import useCartStore from "@/store/store";

export default function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<any | null>(null);

  // Get the current language from the URL
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  // Get cart items and total
  const cartItems = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const totalPrice = getTotalPrice(lang);

  // Determine currency based on language
  const currency = lang === "pl" ? "PLN" : "EUR";

  const handleShippingComplete = (data: any, secret: string) => {
    setShippingData(data);
    setClientSecret(secret);
  };

  return (
    <>
      <ShippingAddressForm
        onShippingComplete={handleShippingComplete}
        cartItems={cartItems}
        totalPrice={totalPrice}
        currency={currency}
        lang={lang}
      />
      <div className="bg-muted px-4 py-8 lg:px-8">
        <OrderSummary
          clientSecret={clientSecret}
          shippingData={shippingData}
          shippingMethod={shippingData?.shippingMethod}
          cartItems={cartItems}
          totalPrice={totalPrice}
          currency={currency}
          lang={lang}
        />
      </div>
    </>
  );
}
