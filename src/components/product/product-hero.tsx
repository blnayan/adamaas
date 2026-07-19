"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/payload-types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";
import { resolveImage, resolveImageOrFallback } from "@/lib/media";
import { getDefaultVariant } from "@/lib/products";
import { useCart, Variant } from "@/lib/cart-context";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    getDefaultVariant(product),
  );
  const variantImages = (selectedVariant?.images ?? []).flatMap((entry) => {
    const image = resolveImage(entry.image, product.name);
    return image ? [image] : [];
  });
  // Variant without photos yet? Fall back to the product's hero image, then
  // the site logo, so the hero never renders an empty frame.
  const images =
    variantImages.length > 0
      ? variantImages
      : [resolveImageOrFallback(product.heroImage, product.name)];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];

  return (
    <section className="container px-4 md:px-8 max-w-screen-2xl pt-4 md:pt-28 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="space-y-4">
          {/* Fixed-ratio canvas: images letterbox inside via object-contain,
              so swapping between differently sized images never shifts the
              layout. */}
          <AspectRatio
            ratio={4 / 3}
            className="rounded-lg overflow-hidden bg-muted"
          >
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            )}
          </AspectRatio>
          {images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image, i) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "relative size-20 rounded-md overflow-hidden bg-muted border-2 transition-colors",
                    i === selectedIndex
                      ? "border-primary"
                      : "border-transparent hover:border-border",
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 md:py-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            {product.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            {product.tagline}
          </p>
          {product.heroDescription && (
            <p className="text-lg text-muted-foreground/80">
              {product.heroDescription}
            </p>
          )}

          <div className="pt-4 space-y-4 max-w-sm">
            <div className="text-3xl font-bold text-primary">
              {formatUsd(selectedVariant?.price ?? product.basePrice)}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <Select
                  value={selectedVariant?.name}
                  onValueChange={(val) => {
                    const variant = product.variants?.find(
                      (v) => v.name === val,
                    );
                    if (variant) {
                      setSelectedVariant(variant);
                      setSelectedIndex(0);
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-input border-input">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.name}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVariant?.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedVariant.description}
                  </p>
                )}
              </div>
            )}
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              onClick={() => addItem(product, selectedVariant)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
