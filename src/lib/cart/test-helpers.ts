import type { Product } from "@/payload-types";

let nextId = 1;

export function makeProduct(overrides: Partial<Product> = {}): Product {
  const id = overrides.id ?? nextId++;
  return {
    id,
    name: `Product ${id}`,
    type: "product",
    slug: `product-${id}`,
    tagline: "A test product",
    basePrice: 100,
    description: "Test description",
    image: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
