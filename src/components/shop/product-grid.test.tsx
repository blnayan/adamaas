import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/lib/cart-context";
import { makeMedia, makeProduct } from "@/lib/cart/test-helpers";
import { ProductGrid } from "./product-grid";

function makeProducts(count: number) {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({
      id: i + 1,
      name: `Product ${i + 1}`,
      slug: `product-${i + 1}`,
      heroImage: makeMedia({
        id: i + 1,
        alt: `Product ${i + 1} hero`,
        url: `/media/product-${i + 1}.jpg`,
      }),
    }),
  );
}

describe("ProductGrid", () => {
  it("eager-loads the first row of card images and lazy-loads the rest", () => {
    // The first row is above the fold, so its images are LCP candidates and
    // must not be lazy-loaded.
    render(
      <CartProvider>
        <ProductGrid products={makeProducts(4)} />
      </CartProvider>,
    );

    for (const i of [1, 2, 3]) {
      const image = screen.getByAltText(`Product ${i} hero`);
      expect(image).not.toHaveAttribute("loading", "lazy");
    }
    expect(screen.getByAltText("Product 4 hero")).toHaveAttribute(
      "loading",
      "lazy",
    );
  });
});
