import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Product } from "@/payload-types";
import { CartProvider } from "@/lib/cart-context";
import { getCartSnapshot, resetCartForTests } from "@/lib/cart/store";
import { makeMedia, makeProduct } from "@/lib/cart/test-helpers";
import { ProductHero } from "./product-hero";

// The hero's buy box uses the cart context, so every render needs a provider.
function renderHero(product: Product) {
  return render(
    <CartProvider>
      <ProductHero product={product} />
    </CartProvider>,
  );
}

describe("ProductHero", () => {
  it("shows the selected variant's first image, without the video placeholder", () => {
    renderHero(
      makeProduct({
        variants: [
          {
            name: "Full Kit",
            price: 269,
            images: [
              { image: makeMedia({ id: 1, alt: "Front view", url: "/media/front.jpg" }) },
              { image: makeMedia({ id: 2, alt: "Side view", url: "/media/side.jpg" }) },
            ],
          },
        ],
      }),
    );
    expect(screen.getAllByAltText("Front view").length).toBeGreaterThan(0);
    expect(screen.queryByText("CINEMATIC")).not.toBeInTheDocument();
  });

  it("swaps the main image when a thumbnail is clicked", async () => {
    const user = userEvent.setup();
    renderHero(
      makeProduct({
        variants: [
          {
            name: "Full Kit",
            price: 269,
            images: [
              { image: makeMedia({ id: 1, alt: "Front view", url: "/media/front.jpg" }) },
              { image: makeMedia({ id: 2, alt: "Side view", url: "/media/side.jpg" }) },
            ],
          },
        ],
      }),
    );

    // Main image + its thumbnail share alt text; the unselected image only
    // appears as a thumbnail.
    expect(screen.getAllByAltText("Front view")).toHaveLength(2);
    expect(screen.getAllByAltText("Side view")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Side view" }));

    expect(screen.getAllByAltText("Side view")).toHaveLength(2);
    expect(screen.getAllByAltText("Front view")).toHaveLength(1);
  });

  it("swaps the gallery and resets the thumbnail selection when the variant changes", async () => {
    const user = userEvent.setup();
    renderHero(
      makeProduct({
        variants: [
          {
            name: "Frame Pack",
            price: 29,
            images: [
              { image: makeMedia({ id: 1, alt: "Frame front", url: "/media/frame-front.jpg" }) },
              { image: makeMedia({ id: 2, alt: "Frame side", url: "/media/frame-side.jpg" }) },
            ],
          },
          {
            name: "Full Kit",
            price: 269,
            images: [
              { image: makeMedia({ id: 3, alt: "Kit front", url: "/media/kit-front.jpg" }) },
              { image: makeMedia({ id: 4, alt: "Kit side", url: "/media/kit-side.jpg" }) },
            ],
          },
        ],
      }),
    );

    // Move off the first thumbnail so the reset is observable.
    await user.click(screen.getByRole("button", { name: "Frame side" }));
    expect(screen.getAllByAltText("Frame side")).toHaveLength(2);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Full Kit" }));

    // New variant's first image is the main image again (index reset):
    // without the reset, index 1 would make "Kit side" the main image.
    expect(screen.getAllByAltText("Kit front")).toHaveLength(2);
    expect(screen.getAllByAltText("Kit side")).toHaveLength(1);
    expect(screen.queryByAltText("Frame front")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Frame side")).not.toBeInTheDocument();
  });

  it("falls back to the hero image when there are no gallery images", () => {
    renderHero(
      makeProduct({
        heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
      }),
    );
    expect(screen.getByAltText("Nomad hero shot")).toBeInTheDocument();
  });

  it("falls back to the hero image when the selected variant has no images", () => {
    renderHero(
      makeProduct({
        heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
        variants: [{ name: "Frame Pack", price: 29 }],
      }),
    );
    expect(screen.getByAltText("Nomad hero shot")).toBeInTheDocument();
  });

  it("shows the site logo when the product has no images at all", () => {
    renderHero(makeProduct({ name: "Bare Product" }));
    expect(screen.getByAltText("Bare Product")).toHaveAttribute(
      "src",
      expect.stringContaining("Adamaas_Logo"),
    );
  });

  it("renders the product name and tagline", () => {
    renderHero(
      makeProduct({ name: "ADAMAAS Nomad", tagline: "Silent cruiser" }),
    );
    expect(screen.getByRole("heading", { name: "ADAMAAS Nomad" })).toBeInTheDocument();
    expect(screen.getByText("Silent cruiser")).toBeInTheDocument();
  });

  it("shows the hero description when the product has one", () => {
    renderHero(
      makeProduct({ heroDescription: "18650-powered, low-profile PCTG frame." }),
    );
    expect(
      screen.getByText("18650-powered, low-profile PCTG frame."),
    ).toBeInTheDocument();
  });

  describe("buy box", () => {
    beforeEach(() => {
      window.localStorage.clear();
      resetCartForTests();
    });

    it("adds the product with its first variant to the cart", async () => {
      const user = userEvent.setup();
      const product = makeProduct({
        variants: [
          { name: "Frame Pack", price: 29 },
          { name: "Full Kit", price: 269 },
        ],
      });
      renderHero(product);

      expect(screen.getByText("$29.00")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Add to Cart" }));

      const cart = getCartSnapshot();
      expect(cart).toHaveLength(1);
      expect(cart[0].product.id).toBe(product.id);
      expect(cart[0].variant?.name).toBe("Frame Pack");
    });

    it("preselects the variant flagged as default in the admin", async () => {
      const user = userEvent.setup();
      const product = makeProduct({
        variants: [
          { name: "Frame Pack", price: 29 },
          { name: "Full Kit", price: 269, isDefault: true },
        ],
      });
      renderHero(product);

      expect(screen.getByText("$269.00")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Add to Cart" }));

      expect(getCartSnapshot()[0].variant?.name).toBe("Full Kit");
    });

    it("shows the selected variant's description under the selector", async () => {
      const user = userEvent.setup();
      renderHero(
        makeProduct({
          variants: [
            {
              name: "Frame Pack",
              price: 29,
              description: "Printed frame parts only.",
            },
            { name: "Full Kit", price: 269 },
          ],
        }),
      );

      expect(screen.getByText("Printed frame parts only.")).toBeInTheDocument();

      // Full Kit has no description — the line disappears.
      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Full Kit" }));
      expect(
        screen.queryByText("Printed frame parts only."),
      ).not.toBeInTheDocument();
    });

    it("adds the variant picked in the selector, at its price", async () => {
      const user = userEvent.setup();
      renderHero(
        makeProduct({
          variants: [
            { name: "Frame Pack", price: 29 },
            { name: "Full Kit", price: 269 },
          ],
        }),
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Full Kit" }));

      expect(screen.getByText("$269.00")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Add to Cart" }));

      expect(getCartSnapshot()[0].variant).toMatchObject({
        name: "Full Kit",
        price: 269,
      });
    });

    it("uses the base price and no variant when the product has none", async () => {
      const user = userEvent.setup();
      const product = makeProduct({ basePrice: 100, variants: [] });
      renderHero(product);

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(screen.getByText("$100.00")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Add to Cart" }));

      const cart = getCartSnapshot();
      expect(cart).toHaveLength(1);
      expect(cart[0].variant).toBeUndefined();
    });
  });
});
