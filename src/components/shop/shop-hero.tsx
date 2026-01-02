import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/payload-types";

interface ShopHeroProps {
  bundle: Product;
}

export function ShopHero({ bundle }: ShopHeroProps) {
  return (
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
            <Link href={`/product/${bundle.slug}`}>
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
  );
}
