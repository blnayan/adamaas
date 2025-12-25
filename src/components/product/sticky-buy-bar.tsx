"use client";

import { Product } from "@/payload-types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart, Variant } from "@/lib/cart-context";

interface StickyBuyBarProps {
  product: Product;
}

export function StickyBuyBar({ product }: StickyBuyBarProps) {
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0],
  );

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling past hero (approx 80vh)
      if (window.scrollY > window.innerHeight * 0.7) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl rounded-full p-2 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl z-40 transition-all duration-500 ease-in-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex items-center justify-between px-2">
        <div className="hidden md:flex flex-col ml-4">
          <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {product.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
          {product.variants && product.variants.length > 0 ? (
            <Select
              value={selectedVariant?.name}
              onValueChange={(val) => {
                const variant = product.variants?.find((v) => v.name === val);
                if (variant) setSelectedVariant(variant);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px] h-10 rounded-full bg-muted/50 border-transparent focus:ring-0 focus:ring-offset-0 text-xs md:text-sm">
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

          <div className="hidden sm:block mx-2">
            <span className="font-bold text-sm text-foreground">
              ${selectedVariant?.price ?? product.basePrice}
            </span>
          </div>

          <Button
            size="lg"
            className="h-10 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shrink-0 text-sm"
            onClick={() => addItem(product, selectedVariant)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
