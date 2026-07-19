import { afterEach, describe, expect, it, vi } from "vitest";
import { makeMedia, makeProduct } from "@/lib/cart/test-helpers";
import { productJsonLd, productMetadata } from "./product-metadata";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("productMetadata", () => {
  it("titles the page with the product name, tagline, and brand", () => {
    const metadata = productMetadata(
      makeProduct({ name: "ADAMAAS Nomad", tagline: "Silent cruiser" }),
    );
    expect(metadata.title).toBe("ADAMAAS Nomad — Silent cruiser | Adamaas");
  });

  it("describes the page with the hero description when present", () => {
    const metadata = productMetadata(
      makeProduct({
        description: "Long form copy.",
        heroDescription: "18650-powered, low-profile PCTG frame.",
      }),
    );
    expect(metadata.description).toBe(
      "18650-powered, low-profile PCTG frame.",
    );
  });

  it("falls back to the full description when there is no hero description", () => {
    const metadata = productMetadata(
      makeProduct({ description: "Long form copy.", heroDescription: null }),
    );
    expect(metadata.description).toBe("Long form copy.");
  });

  it("builds OpenGraph data with the product URL and an absolute hero image", () => {
    vi.stubEnv("NEXT_PUBLIC_URL", "https://adamaas.example");
    const metadata = productMetadata(
      makeProduct({
        slug: "nomad",
        heroImage: makeMedia({ url: "/media/nomad.jpg", alt: "Nomad drone" }),
      }),
    );
    expect(metadata.openGraph).toMatchObject({
      url: "https://adamaas.example/product/nomad",
      images: [
        { url: "https://adamaas.example/media/nomad.jpg", alt: "Nomad drone" },
      ],
    });
  });

  it("omits OpenGraph images when the product has no hero image", () => {
    const metadata = productMetadata(makeProduct({ heroImage: null }));
    expect(metadata.openGraph?.images).toBeUndefined();
  });
});

describe("productJsonLd", () => {
  it("describes a variant-less product as one offer at the base price", () => {
    vi.stubEnv("NEXT_PUBLIC_URL", "https://adamaas.example");
    const jsonLd = productJsonLd(
      makeProduct({
        name: "ADAMAAS Nomad",
        slug: "nomad",
        basePrice: 249,
        description: "Long form copy.",
      }),
    );
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "ADAMAAS Nomad",
      description: "Long form copy.",
      offers: {
        "@type": "Offer",
        price: 249,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://adamaas.example/product/nomad",
      },
    });
  });

  it("lists one offer per variant at the variant's price", () => {
    const jsonLd = productJsonLd(
      makeProduct({
        variants: [
          { name: "Frame Pack", price: 29 },
          { name: "Full Kit", price: 269 },
        ],
      }),
    );
    expect(jsonLd.offers).toEqual([
      expect.objectContaining({
        "@type": "Offer",
        name: "Frame Pack",
        price: 29,
      }),
      expect.objectContaining({
        "@type": "Offer",
        name: "Full Kit",
        price: 269,
      }),
    ]);
  });

  it("includes the hero image as an absolute URL, omitting it when absent", () => {
    vi.stubEnv("NEXT_PUBLIC_URL", "https://adamaas.example");
    const withImage = productJsonLd(
      makeProduct({ heroImage: makeMedia({ url: "/media/nomad.jpg" }) }),
    );
    expect(withImage.image).toBe("https://adamaas.example/media/nomad.jpg");

    const withoutImage = productJsonLd(makeProduct({ heroImage: null }));
    expect(withoutImage).not.toHaveProperty("image");
  });
});
