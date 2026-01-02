"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/payload-types";
import { useCart, Variant } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0],
  );

  return (
    <Card className="h-full border-border bg-card flex flex-col overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="px-6">
        <div className="rounded-lg overflow-hidden bg-muted relative">
          <AspectRatio ratio={16 / 9}>
            <Link
              href={`/product/${product.slug}`}
              className="block h-full w-full relative"
            >
              {product.image &&
              typeof product.image !== "number" &&
              product.image.url ? (
                <Image
                  src={product.image.url}
                  alt={product.image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm group-hover:scale-105 transition-transform duration-500">
                  {product.name}
                </div>
              )}
            </Link>
            <div className="absolute top-2 left-2 flex flex-col gap-2 pointer-events-none">
              {product.badges?.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="w-fit bg-background/80 backdrop-blur text-foreground border border-border"
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          </AspectRatio>
        </div>
      </div>

      <CardContent className="px-6 flex flex-col gap-2 grow">
        <div className="flex justify-between items-start">
          <Link
            href={`/shop/${product.slug}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="text-xl font-bold">{product.name}</h3>
          </Link>
          <span className="text-lg font-bold text-primary">
            ${selectedVariant?.price ?? product.basePrice}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.tagline}
        </p>

        <div className="mt-auto pt-4">
          {product.variants && product.variants.length > 0 ? (
            <Select
              value={selectedVariant?.name}
              onValueChange={(val) => {
                const variant = product.variants?.find((v) => v.name === val);
                if (variant) setSelectedVariant(variant);
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
          ) : null}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          onClick={() => addItem(product, selectedVariant)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
