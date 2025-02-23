"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/store";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

export default function CartDropdown() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const cartItems = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const removeFromCart = useCartStore((state) => state.removeItem);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-colors bg-transparent hover:bg-transparent hover:text-primary"
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="font-medium">Shopping Cart</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
        <Separator />
        <div
          className={cn(
            "max-h-[400px] overflow-auto px-1",
            cartItems.length === 0 && "flex items-center justify-center py-8"
          )}
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add items to your cart to see them here
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="group relative flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
                >
                  <div className="relative h-16 w-16 overflow-hidden">
                    <Image
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      src={
                        item.product.images
                          ? urlFor(item.product.images[0]).url()
                          : ""
                      }
                      alt={item.product.name ?? "Product Image"}
                      fill
                      sizes="64px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="line-clamp-1 font-medium">
                      {item.product.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        €{(item.product.eurprice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4 p-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
