"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product, Variant } from "@/lib/data";
import { toast } from "sonner";

export interface CartItem {
  id: string; // Unique ID (product.slug + variant)
  product: Product;
  variant?: Variant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: Variant) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    // ensures that the functions are only called after the component is mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // ensures this function is only called after the component is mounted to prevent race conditions
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items, isMounted]);

  const addItem = useCallback(
    (product: Product, variant?: Variant) => {
      if (!isMounted) return; // ensures this function is only called after the component is mounted to prevent race conditions
      setItems((prev) => {
        const itemId = variant
          ? `${product.slug}-${variant.name}`
          : product.slug;
        const existing = prev.find((item) => item.id === itemId);

        if (existing) {
          toast.success(`Added another ${product.name} to cart`);
          return prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        toast.success(`Added ${product.name} to cart`);
        return [...prev, { id: itemId, product, variant, quantity: 1 }];
      });
    },
    [isMounted],
  );

  const removeItem = useCallback(
    (itemId: string) => {
      if (!isMounted) return; // ensures this function is only called after the component is mounted to prevent race conditions
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    },
    [isMounted],
  );

  const clearCart = useCallback(() => {
    if (!isMounted) return; // ensures this function is only called after the component is mounted to prevent race conditions
    setItems([]);
  }, [isMounted]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      itemCount,
      isOpen,
      setIsOpen,
    }),
    [items, addItem, removeItem, clearCart, itemCount, isOpen],
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
