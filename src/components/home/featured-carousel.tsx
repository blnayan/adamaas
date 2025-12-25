import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Product } from "@/payload-types";

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Featured Projects
            </h2>
            <p className="text-muted-foreground">
              Battle-tested hardware ready for the field.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center text-primary hover:text-primary/90 font-semibold"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No featured products available at the moment.
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[85vw] md:min-w-0 md:flex-1 snap-center"
              >
                <Link href={`/shop/${product.slug}`}>
                  <Card className="h-full border-border bg-card hover:border-primary/50 transition-colors duration-300 overflow-hidden group">
                    <CardContent className="px-6 flex flex-col h-full gap-6">
                      <div className="relative aspect-video bg-muted overflow-hidden rounded-lg">
                        {/* Placeholder for Product Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-xs">
                          {product.name} Preview
                        </div>
                      </div>
                      <div className="flex flex-col grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold">{product.name}</h3>
                          <span className="text-primary font-mono font-bold">
                            ${product.basePrice}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {product.tagline}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {product.badges?.map((badge) => (
                            <Badge
                              key={badge.id}
                              variant="secondary"
                              className="bg-muted text-muted-foreground pointer-events-none"
                            >
                              {badge.text}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 md:hidden text-center">
          <Link href="/shop">
            <Button variant="ghost" className="text-primary">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
