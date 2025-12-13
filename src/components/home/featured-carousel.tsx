import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function FeaturedCarousel() {
  // Only show first 3 products for featured section
  const featuredProducts = PRODUCTS.slice(0, 3);

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

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {featuredProducts.map((product) => (
            <div key={product.id} className="flex-1">
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
                        {product.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="secondary"
                            className="bg-muted text-muted-foreground pointer-events-none"
                          >
                            {badge}
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
