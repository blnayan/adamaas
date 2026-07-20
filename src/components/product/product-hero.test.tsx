import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Product } from "@/payload-types";
import { CartSheet } from "@/components/layout/cart-sheet";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { getCartSnapshot, resetCartForTests } from "@/lib/cart/store";
import { makeMedia, makeProduct } from "@/lib/cart/test-helpers";
import { ProductHero } from "./product-hero";

// The real @google/model-viewer registers a WebGL custom element that jsdom
// can't run; the <model-viewer> tag itself still renders without it.
vi.mock("@google/model-viewer", () => ({}));

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

  describe("3D model view", () => {
    it("toggles the main canvas between photos and the 3D viewer", async () => {
      const user = userEvent.setup();
      const { container } = renderHero(
        makeProduct({
          heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
          model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
        }),
      );

      expect(container.querySelector("model-viewer")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "View in 3D" }));

      expect(container.querySelector("model-viewer")).toHaveAttribute(
        "src",
        "/media/nomad.glb",
      );
      // Inline, vertical swipes must keep scrolling the page.
      expect(container.querySelector("model-viewer")).toHaveAttribute(
        "touch-action",
        "pan-y",
      );
      expect(screen.queryByAltText("Nomad hero shot")).not.toBeInTheDocument();

      // The button flips into the way back to the photos.
      await user.click(screen.getByRole("button", { name: "View photos" }));

      expect(container.querySelector("model-viewer")).not.toBeInTheDocument();
      expect(screen.getByAltText("Nomad hero shot")).toBeInTheDocument();
    });

    it("keeps the thumbnail rail photos-only", () => {
      renderHero(
        makeProduct({
          model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
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
      // Two photo thumbnails + main image + the 3D toggle — no 3D thumbnail.
      expect(screen.getByRole("button", { name: "View in 3D" })).toBeInTheDocument();
      expect(screen.getAllByAltText("Front view")).toHaveLength(2);
      expect(screen.getAllByAltText("Side view")).toHaveLength(1);
      expect(
        screen.queryByRole("button", { name: "View 3D model" }),
      ).not.toBeInTheDocument();
    });

    it("returns to photos when a thumbnail is clicked while the 3D view is open", async () => {
      const user = userEvent.setup();
      const { container } = renderHero(
        makeProduct({
          model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
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

      await user.click(screen.getByRole("button", { name: "View in 3D" }));
      await user.click(screen.getByRole("button", { name: "Side view" }));

      expect(container.querySelector("model-viewer")).not.toBeInTheDocument();
      expect(screen.getAllByAltText("Side view")).toHaveLength(2);
    });

    it("keeps AR off the inline desktop viewer so nothing collides with the toggle", async () => {
      const user = userEvent.setup();
      const { container } = renderHero(
        makeProduct({
          model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
          modelUsdz: makeMedia({ id: 10, alt: "Nomad AR model", url: "/media/nomad.usdz" }),
        }),
      );

      await user.click(screen.getByRole("button", { name: "View in 3D" }));

      const viewer = container.querySelector("model-viewer");
      expect(viewer).not.toHaveAttribute("ar");
      expect(viewer).not.toHaveAttribute("ios-src");
    });

    it("returns to the new variant's photos when the variant changes in 3D view", async () => {
      const user = userEvent.setup();
      const { container } = renderHero(
        makeProduct({
          model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
          variants: [
            {
              name: "Frame Pack",
              price: 29,
              images: [
                { image: makeMedia({ id: 1, alt: "Frame front", url: "/media/frame-front.jpg" }) },
              ],
            },
            {
              name: "Full Kit",
              price: 269,
              images: [
                { image: makeMedia({ id: 2, alt: "Kit front", url: "/media/kit-front.jpg" }) },
              ],
            },
          ],
        }),
      );

      await user.click(screen.getByRole("button", { name: "View in 3D" }));
      expect(container.querySelector("model-viewer")).toBeInTheDocument();

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Full Kit" }));

      expect(container.querySelector("model-viewer")).not.toBeInTheDocument();
      expect(screen.getByAltText("Kit front")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "View in 3D" })).toBeInTheDocument();
    });

    describe("on a mobile viewport", () => {
      // The setup-file matchMedia stub never matches, which reads as desktop.
      // Simulate a phone by matching max-width queries.
      let desktopMatchMedia: typeof window.matchMedia;

      beforeEach(() => {
        desktopMatchMedia = window.matchMedia;
        window.matchMedia = (query: string) =>
          ({
            ...desktopMatchMedia(query),
            matches: query.includes("max-width"),
          }) as MediaQueryList;
      });

      afterEach(() => {
        window.matchMedia = desktopMatchMedia;
      });

      it("opens the model fullscreen in a dialog, leaving the canvas on photos", async () => {
        const user = userEvent.setup();
        renderHero(
          makeProduct({
            heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
            model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
          }),
        );

        await user.click(screen.getByRole("button", { name: "View in 3D" }));

        const dialog = await screen.findByRole("dialog");
        expect(dialog.querySelector("model-viewer")).toHaveAttribute(
          "src",
          "/media/nomad.glb",
        );
        // The inline canvas never swaps — the photo is still mounted behind
        // the overlay, ready for when the dialog closes.
        expect(screen.getByAltText("Nomad hero shot")).toBeInTheDocument();
      });

      it("claims all touch gestures for the fullscreen viewer", async () => {
        const user = userEvent.setup();
        renderHero(
          makeProduct({
            model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
          }),
        );

        await user.click(screen.getByRole("button", { name: "View in 3D" }));

        const dialog = await screen.findByRole("dialog");
        // Nothing scrolls behind the overlay, so rotate/zoom own every finger.
        expect(dialog.querySelector("model-viewer")).toHaveAttribute(
          "touch-action",
          "none",
        );
      });

      it("keeps AR off the fullscreen viewer while AR is disabled", async () => {
        const user = userEvent.setup();
        renderHero(
          makeProduct({
            model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
            modelUsdz: makeMedia({ id: 10, alt: "Nomad AR model", url: "/media/nomad.usdz" }),
          }),
        );

        await user.click(screen.getByRole("button", { name: "View in 3D" }));

        const dialog = await screen.findByRole("dialog");
        const viewer = dialog.querySelector("model-viewer");
        expect(viewer).not.toHaveAttribute("ar");
        expect(viewer).not.toHaveAttribute("ios-src");
      });

      it("returns to the photos when the dialog is closed", async () => {
        const user = userEvent.setup();
        renderHero(
          makeProduct({
            heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
            model3d: makeMedia({ id: 9, alt: "Nomad 3D model", url: "/media/nomad.glb" }),
          }),
        );

        await user.click(screen.getByRole("button", { name: "View in 3D" }));
        await screen.findByRole("dialog");

        await user.click(screen.getByRole("button", { name: "Close" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.getByAltText("Nomad hero shot")).toBeInTheDocument();
        // The toggle is ready for another round.
        expect(
          screen.getByRole("button", { name: "View in 3D" }),
        ).toBeInTheDocument();
      });
    });

    it("omits the 3D button when the product has no model", () => {
      renderHero(
        makeProduct({
          heroImage: makeMedia({ alt: "Nomad hero shot", url: "/media/nomad.jpg" }),
        }),
      );
      expect(
        screen.queryByRole("button", { name: "View in 3D" }),
      ).not.toBeInTheDocument();
    });
  });

  it("renders the product name and tagline", () => {
    renderHero(
      makeProduct({ name: "ADAMAAS Nomad", tagline: "Silent cruiser" }),
    );
    expect(screen.getByRole("heading", { name: "ADAMAAS Nomad" })).toBeInTheDocument();
    expect(screen.getByText("Silent cruiser")).toBeInTheDocument();
  });

  describe("badges", () => {
    it("shows each badge as a chip", () => {
      renderHero(
        makeProduct({
          badges: [{ text: "New" }, { text: "Best Seller" }],
        }),
      );
      const list = screen.getByRole("list", { name: "Badges" });
      expect(list).toHaveTextContent("New");
      expect(list).toHaveTextContent("Best Seller");
    });

    it("omits the badge list when the product has none", () => {
      renderHero(makeProduct());
      expect(
        screen.queryByRole("list", { name: "Badges" }),
      ).not.toBeInTheDocument();
    });

    it("skips badge rows with no text", () => {
      renderHero(makeProduct({ badges: [{ text: null }] }));
      expect(
        screen.queryByRole("list", { name: "Badges" }),
      ).not.toBeInTheDocument();
    });
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

    it("offers a View cart action on the added-to-cart toast", async () => {
      const user = userEvent.setup();
      render(
        <CartProvider>
          <ProductHero product={makeProduct()} />
          <CartSheet>
            <button type="button">cart trigger</button>
          </CartSheet>
          <Toaster />
        </CartProvider>,
      );

      await user.click(screen.getByRole("button", { name: "Add to Cart" }));
      await user.click(
        await screen.findByRole("button", { name: "View cart" }),
      );

      expect(await screen.findByText("Your Cart (1)")).toBeInTheDocument();
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
