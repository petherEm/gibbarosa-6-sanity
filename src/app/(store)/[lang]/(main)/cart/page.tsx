"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import AddToCartButton from "@/components/AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store/store";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
// import {
//   createCheckoutSession,
//   Metadata,
// } from "../../../../../../actions/createCheckoutSession";
import RemoveFromCartButton from "@/components/RemoveFromCartButton";

const CartPage = () => {
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  console.log("Store cart", groupedItems);

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h1>
        <p className="text-gray-600 text-lg">Your cart is empty</p>
      </div>
    );
  }

  // const handleCheckout = async () => {
  //   setIsLoading(true);

  //   try {
  //     const metadata: Metadata = {
  //       orderNumber: crypto.randomUUID(),
  //       customerName: "John Doe",
  //       customerEmail: "john@email.com",
  //       customerPhone: "1212121212",
  //       shippingAddress: "Rue 2121",
  //       shippingCity: "Paris",
  //       shippingZip: "092121",
  //       shippingCountry: "France",
  //     };

  //     const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

  //     if (checkoutUrl) {
  //       window.location.href = checkoutUrl;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="">
                  {item.product.images && (
                    <Image
                      src={urlFor(item.product.images[0]).url()}
                      alt={item.product.name ?? "Product Image"}
                      className="object-contain"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {item.product.name}
                  </h2>
                  <p>
                    EUR{" "}
                    {((item.product.eurprice ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>{item.product.name}</div>
              <div className="flex items-center ml-4 flex-shrink-0">
                <RemoveFromCartButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold">Order Summary</h3>

          <div>
            <p>
              <span>Items:</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                $ {useCartStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            disabled={isLoading}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Processing..." : "Checkout"}
          </button>
        </div>

        <div className="h-64 lg:h-0"></div>
      </div>
    </div>
  );
};

export default CartPage;
