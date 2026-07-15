import type { Product } from "@/payload-types";
import { z } from "zod";

export type Variant = NonNullable<Product["variants"]>[number];

export interface CartItem {
  /** Unique line id (product id + variant name). */
  id: string;
  product: Product;
  variant?: Variant;
  quantity: number;
}

export function cartItemId(product: Product, variant?: Variant): string {
  return variant ? `${product.id}-${variant.name}` : String(product.id);
}

export function addItem(
  items: CartItem[],
  product: Product,
  variant?: Variant,
): CartItem[] {
  const id = cartItemId(product, variant);
  const existing = items.find((item) => item.id === id);
  if (existing) {
    return items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }
  return [...items, { id, product, variant, quantity: 1 }];
}

export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

export function unitPrice(item: CartItem): number {
  return item.variant?.price ?? item.product.basePrice;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export interface ReconcileResult {
  items: CartItem[];
  /** True when any line was dropped or its product data refreshed. */
  changed: boolean;
}

/**
 * Sync cart lines against the current product catalog: lines whose product
 * disappeared are dropped, and surviving lines get their product data
 * refreshed so stale prices/names never linger in a saved cart.
 */
export function reconcileCart(
  items: CartItem[],
  catalog: Product[],
): ReconcileResult {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  let changed = false;

  const next: CartItem[] = [];
  for (const item of items) {
    const current = byId.get(item.product.id);
    if (!current) {
      changed = true;
      continue;
    }

    let variant: Variant | undefined;
    if (item.variant) {
      variant = current.variants?.find((v) => v.name === item.variant!.name);
      if (!variant) {
        changed = true;
        continue;
      }
    }

    if (
      JSON.stringify(current) !== JSON.stringify(item.product) ||
      JSON.stringify(variant) !== JSON.stringify(item.variant)
    ) {
      changed = true;
    }
    next.push({ ...item, product: current, variant });
  }

  return { items: next, changed };
}

const storedCartSchema = z.array(
  z.object({
    id: z.string(),
    // Trust reconcileCart to validate product contents against the catalog;
    // here we only guard the fields the UI reads before reconciliation runs.
    product: z.looseObject({
      id: z.number(),
      name: z.string(),
      basePrice: z.number(),
    }),
    variant: z
      .looseObject({ name: z.string(), price: z.number() })
      .optional(),
    quantity: z.int().positive(),
  }),
);

/**
 * Parse a cart persisted in localStorage. Returns an empty cart when the
 * stored value is missing or does not match the expected shape.
 */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    return storedCartSchema.parse(JSON.parse(raw)) as unknown as CartItem[];
  } catch {
    return [];
  }
}
