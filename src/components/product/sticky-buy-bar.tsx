"use client";

import { Product, Variant } from "@/lib/data";
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

interface StickyBuyBarProps {
    product: Product;
}

export function StickyBuyBar({ product }: StickyBuyBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);

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
        <div className={cn(
            "fixed bottom-0 left-0 right-0 py-4 px-4 md:px-8 bg-background/80 backdrop-blur-md border-t border-border z-40 transition-transform duration-300",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            <div className="container max-w-screen-2xl flex items-center justify-between">
                <div className="hidden md:block">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.tagline}</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                     <Select
                        value={selectedVariant}
                        onValueChange={(val) => setSelectedVariant(val as Variant)}
                      >
                        <SelectTrigger className="w-[180px] bg-background border-input">
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
                      
                      <div className="flex flex-col items-end mr-2 hidden sm:flex">
                        <span className="font-bold text-lg text-primary">${product.basePrice}</span>
                      </div>

                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shrink-0">
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
