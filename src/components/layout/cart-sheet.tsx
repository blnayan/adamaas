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
import { useCart } from "@/lib/cart-context";
import { unitPrice } from "@/lib/cart/cart";
import { reconcileWithCatalog } from "@/lib/cart/store";
import { startCheckout } from "@/lib/checkout/client";
import { formatUsd } from "@/lib/format";
import { resolveImage } from "@/lib/media";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, itemCount, total, isOpen, setIsOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    const result = await startCheckout(items);
    switch (result.status) {
      case "redirect":
        window.location.href = result.url;
        break;
      case "cart-outdated":
        // The catalog changed since the cart was saved; sync and let the
        // customer review before paying.
        await reconcileWithCatalog();
        toast.warning(
          "Some items in your cart changed. Please review your cart and try again.",
        );
        setIsLoading(false);
        break;
      case "error":
        toast.error("Failed to start checkout");
        setIsLoading(false);
        break;
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
                {items.map((item) => {
                  const image = resolveImage(
                    item.product.image,
                    item.product.name,
                  );
                  return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                          {item.product.name}
                        </div>
                      )}
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
                        {formatUsd(unitPrice(item))}
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
                  );
                })}
              </div>
            </div>

            <SheetFooter className="border-t border-border px-4 py-4 sm:flex-col sm:justify-center">
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total</span>
                <span>{formatUsd(total)}</span>
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
