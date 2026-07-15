import type Stripe from "stripe";
import type { Product } from "@/payload-types";
import { z } from "zod";

/** What the client is allowed to tell us: which product, which variant, how many. */
export const checkoutItemSchema = z.object({
  productId: z.number(),
  variantName: z.string().optional(),
  quantity: z.int().positive().max(99),
});

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export type LineItemsResult =
  | { ok: true; lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] }
  | { ok: false; unavailable: CheckoutItem[] };

/**
 * Build Stripe line items for the requested cart, pricing every line from
 * the catalog — client-supplied prices are never trusted. Items whose
 * product no longer exists are reported as unavailable.
 */
export function buildLineItems(
  requested: CheckoutItem[],
  catalog: Product[],
): LineItemsResult {
  const byId = new Map(catalog.map((product) => [product.id, product]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of requested) {
    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false, unavailable: [item] };
    }

    const variant = item.variantName
      ? product.variants?.find((v) => v.name === item.variantName)
      : undefined;
    if (item.variantName && !variant) {
      return { ok: false, unavailable: [item] };
    }

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: variant ? `${product.name} (${variant.name})` : product.name,
          description: product.tagline,
        },
        unit_amount: Math.round((variant?.price ?? product.basePrice) * 100),
      },
      quantity: item.quantity,
    });
  }

  return { ok: true, lineItems };
}
