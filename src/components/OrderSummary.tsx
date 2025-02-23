"use client";

import useCartStore from "@/store/store";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Separator } from "./ui/separator";
import { CartItem } from "@/store/store"; // Ensure you have this type defined

const OrderSummary = () => {
  const cartItems = useCartStore((state) => state.items);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.eurprice! * item.quantity,
    0
  );
  const shippingCost = 15; // You might want to make this dynamic
  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={
                  urlFor(item.product.images?.[0]).url() || "/placeholder.png"
                }
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  €{(item.product.eurprice! * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Order Calculations */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <p>Subtotal</p>
          <p>€{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Shipping</p>
          <p>€{shippingCost.toFixed(2)}</p>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <p>Total</p>
          <p>€{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
