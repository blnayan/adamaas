import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ShopPage() {
  const bundle = PRODUCTS.find((p) => p.id === "bundle");
  const otherProducts = PRODUCTS.filter((p) => p.id !== "bundle");

  return (
    <div className="min-h-screen bg-background">
      {/* Bundle Hero Section */}
      {bundle && (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center bg-card border-b border-border">
          {/* Placeholder for Bundle Hero Image/Video */}
          <div className="absolute inset-0 bg-background grid place-items-center opacity-50">
            <div className="text-muted-foreground font-bold text-6xl md:text-9xl opacity-20 select-none">
              BUNDLE
            </div>
          </div>

          <div className="container relative z-10 px-4 md:px-8 max-w-screen-2xl">
            <div className="max-w-2xl space-y-6">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 border-none text-md px-3 py-1">
                Best Value
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter">
                {bundle.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {bundle.tagline}
              </p>
              <p className="text-lg text-muted-foreground max-w-lg">
                {bundle.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={`/shop/${bundle.slug}`}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg font-semibold h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Buy Ecosystem Bundle - ${bundle.basePrice}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="py-20 container px-4 md:px-8 max-w-screen-2xl">
        <h2 className="text-3xl font-bold mb-10 text-foreground">
          Individual Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
