import { describe, expect, it } from "vitest";
import { makeProduct } from "@/lib/cart/test-helpers";
import { getDefaultVariant } from "./products";

describe("getDefaultVariant", () => {
  it("returns the variant flagged as default", () => {
    const product = makeProduct({
      variants: [
        { name: "Frame Pack", price: 29 },
        { name: "Full Kit", price: 269, isDefault: true },
      ],
    });
    expect(getDefaultVariant(product)?.name).toBe("Full Kit");
  });

  it("falls back to the first variant when none is flagged", () => {
    const product = makeProduct({
      variants: [
        { name: "Frame Pack", price: 29 },
        { name: "Full Kit", price: 269 },
      ],
    });
    expect(getDefaultVariant(product)?.name).toBe("Frame Pack");
  });

  it("returns undefined when the product has no variants", () => {
    expect(getDefaultVariant(makeProduct())).toBeUndefined();
    expect(getDefaultVariant(makeProduct({ variants: [] }))).toBeUndefined();
  });
});
