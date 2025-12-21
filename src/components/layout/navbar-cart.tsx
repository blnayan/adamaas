"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartSheet } from "@/components/layout/cart-sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";

export function NavbarCart() {
  const { itemCount } = useCart();

  return (
    <CartSheet>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 rounded-full bg-primary text-primary-foreground text-[8px] pointer-events-none">
            {itemCount > 9 ? "9+" : itemCount}
          </Badge>
        )}
        <span className="sr-only">Cart</span>
      </Button>
    </CartSheet>
  );
}
