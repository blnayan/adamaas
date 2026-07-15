import { z } from "zod";
import type { CartItem } from "@/lib/cart/cart";
import type { CheckoutItem } from "./line-items";

export type StartCheckoutResult =
  | { status: "redirect"; url: string }
  | { status: "cart-outdated" }
  | { status: "error" };

function toCheckoutItems(items: CartItem[]): CheckoutItem[] {
  return items.map((item) => ({
    productId: item.product.id,
    variantName: item.variant?.name,
    quantity: item.quantity,
  }));
}

/**
 * Ask the server to create a Stripe Checkout session for the cart.
 * Never throws — every failure mode is folded into the result so the UI
 * only has to switch on `status`.
 */
export async function startCheckout(
  items: CartItem[],
): Promise<StartCheckoutResult> {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: toCheckoutItems(items) }),
    });

    // The catalog changed since the cart was saved; the caller should
    // reconcile and let the customer review before paying.
    if (response.status === 409) return { status: "cart-outdated" };
    if (!response.ok) return { status: "error" };

    const url = z.url().safeParse((await response.json())?.url);
    if (!url.success) return { status: "error" };
    return { status: "redirect", url: url.data };
  } catch {
    return { status: "error" };
  }
}
