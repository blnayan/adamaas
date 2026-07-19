import type { Product } from "@/payload-types";
import { payloadSdk } from "@/lib/payload-sdk";
import {
  type CartItem,
  type Variant,
  addItem,
  parseStoredCart,
  reconcileCart,
  removeItem,
} from "./cart";

const CART_STORAGE_KEY = "cart";
const EMPTY: CartItem[] = [];

type Listener = () => void;

// Lazily initialized so localStorage is only touched in the browser.
let items: CartItem[] | null = null;
const listeners = new Set<Listener>();

function read(): CartItem[] {
  if (items === null) {
    items =
      typeof window === "undefined"
        ? EMPTY
        : parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  }
  return items;
}

function write(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Persisting is best-effort; the in-memory cart still works.
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): CartItem[] {
  return read();
}

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY;
}

export function addToCart(product: Product, variant?: Variant) {
  write(addItem(read(), product, variant));
}

export function removeFromCart(id: string) {
  write(removeItem(read(), id));
}

export function clearCart() {
  write([]);
}

/**
 * Re-validate the cart against the live catalog (Payload REST API): drops
 * products/variants that no longer exist and refreshes stale prices.
 * Returns whether the cart changed. Network failures leave the cart as-is.
 */
export async function reconcileWithCatalog(): Promise<boolean> {
  const current = read();
  if (current.length === 0) return false;

  const ids = [...new Set(current.map((item) => item.product.id))];
  try {
    const { docs } = await payloadSdk.find({
      collection: "products",
      where: { id: { in: ids } },
      limit: ids.length,
    });
    const { items: next, changed } = reconcileCart(current, docs);
    if (changed) write(next);
    return changed;
  } catch {
    return false;
  }
}

/** Test-only: forget the in-memory cart so it re-reads from localStorage. */
export function resetCartForTests() {
  items = null;
  listeners.clear();
}
