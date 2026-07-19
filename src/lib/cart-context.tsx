"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Product } from "@/payload-types";
import { toast } from "sonner";
import {
  type CartItem,
  type Variant,
  cartTotal,
  itemCount as countItems,
} from "@/lib/cart/cart";
import {
  addToCart,
  clearCart as clearStoredCart,
  getCartSnapshot,
  getServerCartSnapshot,
  reconcileWithCatalog,
  removeFromCart,
  subscribe,
} from "@/lib/cart/store";

export type { CartItem, Variant };

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: Variant) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  // The cart is persisted in localStorage, so products may have been edited
  // or removed from the catalog since it was saved. Re-validate on mount.
  useEffect(() => {
    reconcileWithCatalog().then((changed) => {
      if (changed) {
        toast.info("Your cart was updated to match the current catalog.");
      }
    });
  }, []);

  const addItem = useCallback((product: Product, variant?: Variant) => {
    addToCart(product, variant);
    toast.success(`Added ${product.name} to cart`, {
      action: {
        label: "View cart",
        onClick: () => setIsOpen(true),
      },
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem: removeFromCart,
      clearCart: clearStoredCart,
      itemCount: countItems(items),
      total: cartTotal(items),
      isOpen,
      setIsOpen,
    }),
    [items, addItem, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
