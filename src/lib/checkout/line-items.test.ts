import { describe, it, expect } from "vitest";
import { buildLineItems } from "./line-items";
import { makeProduct } from "@/lib/cart/test-helpers";

describe("buildLineItems", () => {
  it("prices a product from the catalog, in cents", () => {
    const product = makeProduct({
      name: "Reaper",
      tagline: "The Ultimate FPV Racer",
      basePrice: 89,
    });

    const result = buildLineItems(
      [{ productId: product.id, quantity: 2 }],
      [product],
    );

    expect(result).toEqual({
      ok: true,
      lineItems: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Reaper",
              description: "The Ultimate FPV Racer",
            },
            unit_amount: 8900,
          },
          quantity: 2,
        },
      ],
    });
  });

  it("prices a variant from the catalog and includes it in the name", () => {
    const product = makeProduct({
      name: "Reaper",
      basePrice: 89,
      variants: [{ name: "RTF", price: 549 }],
    });

    const result = buildLineItems(
      [{ productId: product.id, variantName: "RTF", quantity: 1 }],
      [product],
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lineItems[0].price_data?.unit_amount).toBe(54900);
    expect(result.lineItems[0].price_data?.product_data?.name).toBe(
      "Reaper (RTF)",
    );
  });

  it("reports items whose product is gone as unavailable", () => {
    const product = makeProduct();

    const result = buildLineItems(
      [
        { productId: product.id, quantity: 1 },
        { productId: 999, quantity: 1 },
      ],
      [product],
    );

    expect(result).toEqual({
      ok: false,
      unavailable: [{ productId: 999, quantity: 1 }],
    });
  });

  it("reports items whose variant is gone as unavailable", () => {
    const product = makeProduct({
      variants: [{ name: "RTF", price: 549 }],
    });

    const result = buildLineItems(
      [{ productId: product.id, variantName: "Frame Only", quantity: 1 }],
      [product],
    );

    expect(result.ok).toBe(false);
  });
});
