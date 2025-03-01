import { Product } from "../../sanity.types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    getTotalPrice: (lang?: string) => number;
    isProductInCart: (productId: string) => boolean;
}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity) => {
                // Since we only allow one of each product, first check if it exists
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    (item) => item.product._id === product._id
                );

                if (existingItem) {
                    console.log("Product already in cart:", product._id);
                    return;
                }

                // If item doesn't exist, add it with quantity 1
                set({
                    items: [...currentItems, {
                        product,
                        quantity: 1 // Always set to 1 since we only have one of each product
                    }]
                });
                console.log("Added new item to cart:", product._id);
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.product._id !== productId),
                });
            },
            clearCart: () => {
                console.log("Clearing cart");
                set({ items: [] });
            },
            getTotalPrice: (lang = "en") => {
                return get().items.reduce((sum, item) => {
                    // Ensure we have valid pricing data
                    if (!item.product || !item.product.pricing) {
                        return sum;
                    }

                    // Calculate price based on language
                    const priceField = lang === "pl" ? "PLN" : "EUR";
                    const price = Number(item.product.pricing[priceField] || 0);

                    // Quantity is always 1 in our case
                    return sum + price;
                }, 0);
            },
            isProductInCart: (productId) => {
                return get().items.some((item) => item.product._id === productId);
            },
        }),
        {
            name: "cart-storage",
        }
    )
);

export default useCartStore;

