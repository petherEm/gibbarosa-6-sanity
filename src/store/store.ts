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
    updateItemQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: (lang?: string) => number;
    isProductInCart: (productId: string) => boolean;
}

const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity) => {
                // Console log to debug
                console.log("Adding to cart:", {
                    product: {
                        _id: product._id,
                        name: product.name,
                        pricing: product.pricing
                    },
                    quantity
                });

                // Ensure quantity is a number
                const safeQuantity = Number(quantity) || 1;

                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex(
                    (item) => item.product._id === product._id
                );

                if (existingItemIndex >= 0) {
                    // If item exists, update quantity
                    const updatedItems = [...currentItems];
                    const existingItem = updatedItems[existingItemIndex];
                    const newQuantity = Number(existingItem.quantity) + safeQuantity;

                    updatedItems[existingItemIndex] = {
                        ...existingItem,
                        quantity: newQuantity
                    };

                    set({ items: updatedItems });
                    console.log("Updated existing item, new quantity:", newQuantity);
                } else {
                    // If item doesn't exist, add it
                    set({
                        items: [...currentItems, {
                            product,
                            quantity: safeQuantity
                        }]
                    });
                    console.log("Added new item with quantity:", safeQuantity);
                }
            },
            removeItem: (productId) => {
                console.log("Removing item:", productId);
                set({
                    items: get().items.filter((item) => item.product._id !== productId),
                });
            },
            updateItemQuantity: (productId, quantity) => {
                // Ensure quantity is a number
                const safeQuantity = Number(quantity) || 1;
                console.log("Updating quantity for:", productId, "to:", safeQuantity);

                set({
                    items: get().items.map((item) =>
                        item.product._id === productId
                            ? { ...item, quantity: safeQuantity }
                            : item
                    ),
                });
            },
            clearCart: () => {
                console.log("Clearing cart");
                set({ items: [] });
            },
            getTotalPrice: (lang = "en") => {
                const total = get().items.reduce((sum, item) => {
                    // Ensure we have valid pricing data
                    if (!item.product || !item.product.pricing) {
                        console.warn("Product or pricing missing:", item.product);
                        return sum;
                    }

                    // Debug the price calculation
                    const priceField = lang === "pl" ? "PLN" : "EUR";
                    const rawPrice = item.product.pricing[priceField];
                    const price = Number(rawPrice) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const itemTotal = price * quantity;

                    console.log("Price calculation:", {
                        product: item.product._id,
                        priceField,
                        rawPrice,
                        price,
                        quantity,
                        itemTotal
                    });

                    return sum + itemTotal;
                }, 0);

                console.log(`Total price (${lang}):`, total);
                return total;
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

