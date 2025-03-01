"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
import useCartStore from "@/store/store";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  //   const { toast } = useToast();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const paymentIntent = searchParams.get("payment_intent");
  const redirect_status = searchParams.get("redirect_status");

  const isSuccessful = redirect_status === "succeeded";

  // Get the language from the URL path
  const lang = pathname.split("/")[1] || "en";

  // Get cart clearing function from store
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear the cart when the page loads with a successful payment
  useEffect(() => {
    if (isSuccessful && paymentIntent) {
      // Clear the cart
      clearCart();

      // Call the clear-cart API (optional, for analytics or other server-side actions)
      fetch("/api/clear-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      }).catch((err) => {
        console.error("Error calling clear-cart API:", err);
      });
    }
  }, [isSuccessful, paymentIntent, clearCart]);

  // Function to manually create the order (for development)
  async function createOrder() {
    if (!paymentIntent) return;

    setIsCreatingOrder(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderCreated(true);
        // toast({
        //   title: "Order created",
        //   description:
        //     "Your order has been successfully created in our system.",
        // });
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error: any) {
      //   toast({
      //     title: "Error",
      //     description: error.message,
      //     variant: "destructive",
      //   });
    } finally {
      setIsCreatingOrder(false);
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {isSuccessful ? (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Thank you for your order!
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment was successful and your order is being processed.
            </p>
            <div className="mb-8 text-left p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 mb-2">Payment Reference:</p>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                {paymentIntent}
              </p>
            </div>

            <div className="mt-6">
              <Link href={`/${lang}`}>
                <Button variant="default" className="mr-4">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* For development environments only - add a way to manually create the order */}
            {process.env.NODE_ENV !== "production" && !orderCreated && (
              <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Development Mode
                </h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Since you're in local development, the webhook might not have
                  triggered. Click below to manually create the order in Sanity.
                </p>
                <Button
                  onClick={createOrder}
                  disabled={isCreatingOrder}
                  variant="outline"
                >
                  {isCreatingOrder ? "Processing..." : "Manually Create Order"}
                </Button>
              </div>
            )}

            {orderCreated && (
              <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
                <p className="text-sm text-green-700">
                  Order successfully created in Sanity!
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Payment was not successful
            </h1>
            <p className="text-gray-600 mb-8">
              There was an issue processing your payment. Please try again.
            </p>
            <Link href={`/${lang}/checkout`}>
              <Button variant="outline">Return to Checkout</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
