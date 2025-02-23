"use client";

import { useState } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import OrderSummary from "@/components/OrderSummary";

export default function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<any | null>(null);

  const handleShippingComplete = (data: any, secret: string) => {
    setShippingData(data);
    setClientSecret(secret);
  };

  return (
    <>
      <ShippingAddressForm onShippingComplete={handleShippingComplete} />
      <div className="bg-muted px-4 py-8 lg:px-8">
        <OrderSummary
          clientSecret={clientSecret}
          shippingData={shippingData}
          shippingMethod={shippingData?.shippingMethod}
        />
      </div>
    </>
  );
}
