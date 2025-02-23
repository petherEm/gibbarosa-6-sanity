"use server";

import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store/store";
import stripe from "@/lib/stripe";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingZip: string;
    shippingCountry: string;
    customerEmail: string;
    
  };


export type GroupedCartItem = {
    product: CartItem["product"];
    quantity: number;
  };
  
// Helper function to get validated base URL
const getValidatedBaseUrl = (): string => {
  const vercelUrl = process.env.VERCEL_URL;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not defined');
  }

  // Ensure baseUrl starts with http(s)
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_BASE_URL must start with http:// or https://');
  }

  return baseUrl;
};

export async function createCheckoutSession(
    items: GroupedCartItem[],
    metadata: Metadata
) {
  
    try {
        // check if any grouped items don't have a price
        const itemsWithoutPrice = items.filter((item) => !item.product.eurprice);
        if (itemsWithoutPrice.length > 0) {
           throw new Error("Some items don't have a price");
        }

        // search for existing customer by email

        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });
        let customerId: string | undefined;

        if(customers.data.length > 0) {
            customerId = customers.data[0].id;
        }

        // Refactored URL configuration
        const checkoutConfig = {
          success_url: `${getValidatedBaseUrl()}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
          cancel_url: `${getValidatedBaseUrl()}/cart`
        };

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: checkoutConfig.success_url,
            cancel_url: checkoutConfig.cancel_url,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "eur",
                    unit_amount: Math.round(item.product.eurprice! * 100),
                    product_data: {
                        name: item.product.name || "Unnamed Product",
                        description: `Product ID: ${item.product._id}`,
                        metadata: {
                            id: item.product._id,
                        },
                        images: item.product.images ? [urlFor(item.product.images[0]).url()] : undefined,
                    }
                    
                },
                quantity: item.quantity,
            }))    
        });

        return session.url;

    } catch (error) {
        console.error(error);
        throw error;
    }
}