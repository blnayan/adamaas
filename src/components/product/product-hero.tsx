"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/payload-types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Rotate3d } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";
import { useMediaQuery } from "@/lib/use-media-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  resolveFileUrl,
  resolveImage,
  resolveImageOrFallback,
} from "@/lib/media";
import { getDefaultVariant } from "@/lib/products";
import { useCart, Variant } from "@/lib/cart-context";
import { ModelViewer } from "./model-viewer";

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
  const modelSrc = resolveFileUrl(product.model3d);
  // Shared by the inline canvas and the fullscreen dialog viewer.
  const modelViewerProps = modelSrc
    ? {
        src: modelSrc,
        iosSrc: resolveFileUrl(product.modelUsdz) ?? undefined,
        poster: resolveImage(product.heroImage)?.url,
        alt: `${product.name} 3D model`,
      }
    : undefined;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  // On phones the inline canvas is too small for orbit gestures, so the 3D
  // toggle opens a fullscreen dialog there instead of swapping the canvas.
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const mainImage = images[selectedIndex];
  const badges = (product.badges ?? []).flatMap((badge) =>
    badge.text ? [{ id: badge.id, text: badge.text }] : [],
  );

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
            {showModel && modelViewerProps ? (
              // AR stays off inline even when re-enabled elsewhere: the
              // toggle button owns the corner the AR badge wants.
              <ModelViewer {...modelViewerProps} ar={false} />
            ) : (
              mainImage && (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              )
            )}
            {modelViewerProps && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="absolute bottom-3 right-3 z-10 gap-1.5 shadow-md"
                onClick={() =>
                  isMobile
                    ? setModelDialogOpen(true)
                    : setShowModel((open) => !open)
                }
              >
                {showModel ? (
                  <ImageIcon aria-hidden className="size-4" />
                ) : (
                  <Rotate3d aria-hidden className="size-4" />
                )}
                {showModel ? "View photos" : "View in 3D"}
              </Button>
            )}
          </AspectRatio>
          {modelViewerProps && (
            <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
              <DialogContent className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-none bg-background p-0 sm:max-w-none">
                <DialogTitle className="sr-only">
                  {product.name} 3D model
                </DialogTitle>
                {/* AR is disabled everywhere for now. */}
                <ModelViewer
                  {...modelViewerProps}
                  touchAction="none"
                  ar={false}
                />
              </DialogContent>
            </Dialog>
          )}
          {images.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image, i) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(i);
                    setShowModel(false);
                  }}
                  className={cn(
                    "relative size-20 rounded-md overflow-hidden bg-muted border-2 transition-colors",
                    i === selectedIndex && !showModel
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
          {badges.length > 0 && (
            <ul aria-label="Badges" className="flex flex-wrap gap-2">
              {badges.map(({ id, text }) => (
                <li key={id ?? text}>
                  <Badge variant="secondary">{text}</Badge>
                </li>
              ))}
            </ul>
          )}
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
                      setShowModel(false);
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
