import type { Metadata } from "next";
import type { Product } from "@/payload-types";
import { getBaseUrl } from "@/lib/env";
import { resolveImage } from "@/lib/media";

// Media URLs are host-relative locally but absolute on blob storage —
// new URL() leaves already-absolute ones untouched.
function absoluteUrl(path: string): string {
  return new URL(path, getBaseUrl()).toString();
}

/** schema.org Product markup for rich results (price shown in search). */
export function productJsonLd(product: Product): Record<string, unknown> {
  const offerBase = {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: absoluteUrl(`/product/${product.slug}`),
  };
  const variants = product.variants ?? [];
  const heroImage = resolveImage(product.heroImage, product.name);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.heroDescription || product.description,
    ...(heroImage && { image: absoluteUrl(heroImage.url) }),
    offers:
      variants.length > 0
        ? variants.map((variant) => ({
            ...offerBase,
            name: variant.name,
            price: variant.price,
          }))
        : { ...offerBase, price: product.basePrice },
  };
}

export function productMetadata(product: Product): Metadata {
  const heroImage = resolveImage(product.heroImage, product.name);
  return {
    title: `${product.name} — ${product.tagline} | Adamaas`,
    description: product.heroDescription || product.description,
    openGraph: {
      url: absoluteUrl(`/product/${product.slug}`),
      ...(heroImage && {
        images: [{ url: absoluteUrl(heroImage.url), alt: heroImage.alt }],
      }),
    },
  };
}
