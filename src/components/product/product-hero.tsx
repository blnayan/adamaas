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
import { ImageIcon, Minus, Plus, Rotate3d } from "lucide-react";
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
import {
  isAddOnVariant,
  ladderKind,
  ladderMatrixCell,
  partitionProductVariants,
  type LadderKind,
} from "@/lib/product-variants";
import { useCart, Variant } from "@/lib/cart-context";
import { ModelViewer } from "./model-viewer";

interface ProductHeroProps {
  product: Product;
}

const MATRIX_ROWS: {
  key: "frame" | "electronics" | "pack" | "o4";
  label: string;
}[] = [
  { key: "frame", label: "Frame" },
  { key: "electronics", label: "Electronics (incl. GPS)" },
  { key: "pack", label: "Auline pack" },
  { key: "o4", label: "O4 Air Unit" },
];

function pickInitialKit(product: Product): Variant | undefined {
  const { ladder, useLadder } = partitionProductVariants(product.variants);
  const fallback = getDefaultVariant(product);
  if (!useLadder) return fallback;
  if (fallback && !isAddOnVariant(fallback)) return fallback;
  return ladder.find((v) => v.isDefault) ?? ladder[0] ?? fallback;
}

function selectKit(
  variant: Variant,
  setSelectedKit: (v: Variant) => void,
  setSelectedIndex: (n: number) => void,
  setShowModel: (v: boolean) => void,
) {
  setSelectedKit(variant);
  setSelectedIndex(0);
  setShowModel(false);
}

export function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    () => pickInitialKit(product),
  );
  const [selectedAddOns, setSelectedAddOns] = useState<Variant[]>([]);
  const [quantity, setQuantity] = useState(1);
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
  const { ladder, addOns, useLadder } = partitionProductVariants(
    product.variants,
  );
  const showMatrix = ladder.some((v) => ladderKind(v) !== "other");
  const unitTotal =
    (selectedVariant?.price ?? product.basePrice) +
    selectedAddOns.reduce((sum, v) => sum + v.price, 0);
  const lineTotal = unitTotal * quantity;

  function toggleAddOn(variant: Variant) {
    setSelectedAddOns((current) => {
      const exists = current.some((v) => v.name === variant.name);
      if (exists) return current.filter((v) => v.name !== variant.name);
      return [...current, variant];
    });
  }

  function addSelectionToCart() {
    if (selectedVariant) {
      addItem(product, selectedVariant, quantity);
    } else if (selectedAddOns.length === 0) {
      addItem(product, undefined, quantity);
    }
    for (const addOn of selectedAddOns) {
      addItem(product, addOn, quantity);
    }
  }

  return (
    <section className="container px-4 md:px-8 max-w-screen-2xl pt-4 md:pt-28 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="space-y-4">
          {/* Fixed-ratio canvas: images letterbox inside via object-contain,
              so swapping between differently sized images never shifts the
              layout. */}
          <AspectRatio
            ratio={4 / 3}
            className="rounded-lg overflow-hidden bg-[#ececec]"
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

          <div className="pt-4 space-y-4 max-w-xl">
            <div className="text-3xl font-bold text-primary">
              {formatUsd(lineTotal)}
            </div>
            {quantity > 1 && (
              <p className="text-sm text-muted-foreground">
                {formatUsd(unitTotal)} each × {quantity}
              </p>
            )}

            {useLadder ? (
              <div className="space-y-6">
                {ladder.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Buy a {product.name}
                    </h2>
                    <div
                      role="radiogroup"
                      aria-label={`${product.name} kit tiers`}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {ladder.map((variant) => {
                        const selected = selectedVariant?.name === variant.name;
                        return (
                          <button
                            key={variant.id ?? variant.name}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() =>
                              selectKit(
                                variant,
                                setSelectedVariant,
                                setSelectedIndex,
                                setShowModel,
                              )
                            }
                            className={cn(
                              "rounded-lg border p-3 text-left transition-colors",
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border hover:border-primary/40",
                            )}
                          >
                            <div className="font-semibold text-foreground">
                              {variant.name}
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {formatUsd(variant.price)}
                            </div>
                            {selected && variant.description && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {variant.description}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showMatrix && (
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-xs sm:text-sm">
                          <caption className="sr-only">
                            What each kit tier includes
                          </caption>
                          <thead>
                            <tr className="border-b border-border bg-muted/40">
                              <th scope="col" className="p-2 text-left font-medium">
                                Includes
                              </th>
                              {ladder.map((variant) => (
                                <th
                                  key={variant.id ?? variant.name}
                                  scope="col"
                                  className="p-2 text-center font-medium"
                                >
                                  {shortTierLabel(ladderKind(variant), variant.name)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {MATRIX_ROWS.map((row) => (
                              <tr
                                key={row.key}
                                className="border-b border-border last:border-0"
                              >
                                <th
                                  scope="row"
                                  className="p-2 text-left font-normal text-muted-foreground"
                                >
                                  {row.label}
                                </th>
                                {ladder.map((variant) => (
                                  <td
                                    key={`${variant.name}-${row.key}`}
                                    className="p-2 text-center tabular-nums"
                                  >
                                    {ladderMatrixCell(
                                      ladderKind(variant),
                                      row.key,
                                    ) || "—"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {addOns.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Add-ons
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Optional — stack with your kit.
                    </p>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {addOns.map((variant) => {
                        const selected = selectedAddOns.some(
                          (v) => v.name === variant.name,
                        );
                        return (
                          <button
                            key={variant.id ?? variant.name}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleAddOn(variant)}
                            className={cn(
                              "rounded-lg border p-3 text-left transition-colors",
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border hover:border-primary/40",
                            )}
                          >
                            <div className="font-semibold text-foreground">
                              {variant.name}
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {formatUsd(variant.price)}
                            </div>
                            {selected && variant.description && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {variant.description}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              product.variants &&
              product.variants.length > 0 && (
                <div className="space-y-2">
                  <Select
                    value={selectedVariant?.name}
                    onValueChange={(val) => {
                      const variant = product.variants?.find(
                        (v) => v.name === val,
                      );
                      if (variant) {
                        selectKit(
                          variant,
                          setSelectedVariant,
                          setSelectedIndex,
                          setShowModel,
                        );
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
              )
            )}

            <div className="space-y-2">
              <label
                htmlFor="product-qty"
                className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" aria-hidden />
                </Button>
                <input
                  id="product-qty"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  className="w-16 rounded-md border border-input bg-input px-2 py-2 text-center font-semibold tabular-nums"
                  value={quantity}
                  onChange={(e) => {
                    const next = Number.parseInt(e.target.value, 10);
                    setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="size-4" aria-hidden />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              onClick={addSelectionToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function shortTierLabel(kind: LadderKind, fallback: string): string {
  switch (kind) {
    case "frame":
      return "Frame";
    case "electronics":
      return "Electronics";
    case "full":
      return "Full";
    case "ultimate":
      return "Ultimate";
    default:
      return fallback;
  }
}
