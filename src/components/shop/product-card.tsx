"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Variant } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0],
  );

  return (
    <Card className="h-full border-border bg-card flex flex-col overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="px-6">
        <div className="relative aspect-square bg-muted overflow-hidden rounded-lg">
          <Link href={`/shop/${product.slug}`}>
            {/* Placeholder Image */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm group-hover:scale-105 transition-transform duration-500">
              {product.name}
            </div>
          </Link>
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="w-fit bg-background/80 backdrop-blur text-foreground border border-border"
              >
                {badge}
              </Badge>
            ))}
          </div>
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
            ${product.basePrice}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.tagline}
        </p>

        <div className="mt-auto pt-4">
          <Select
            value={selectedVariant}
            onValueChange={(val) => setSelectedVariant(val as Variant)}
          >
            <SelectTrigger className="w-full bg-input border-input">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
