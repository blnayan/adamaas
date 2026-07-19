import type { Product } from "@/payload-types";
import type { Variant } from "@/lib/cart/cart";

/**
 * The variant preselected on the product page and shop card: the one the
 * admin flagged as default, else the first. First flagged row wins if the
 * admin somehow checks several.
 */
export function getDefaultVariant(product: Product): Variant | undefined {
  return product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
}
