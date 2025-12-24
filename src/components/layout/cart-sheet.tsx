"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/lib/cart-context";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to populate NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, itemCount, isOpen, setIsOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const total = items.reduce(
    (acc, item) =>
      acc + (item.variant?.price ?? item.product.basePrice) * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-l border-border">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4 px-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                      {/* Placeholder Item Image */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                        {item.product.name}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="font-medium line-clamp-1">
                        {item.product.name}
                      </span>
                      {item.variant && (
                        <span className="text-xs text-muted-foreground">
                          {item.variant.name}
                        </span>
                      )}
                      <span className="text-sm font-bold text-primary">
                        ${item.variant?.price ?? item.product.basePrice}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="border-t border-border px-4 py-4 sm:flex-col sm:justify-center">
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Checkout"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
