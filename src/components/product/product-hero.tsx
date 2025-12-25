import { Product } from "@/payload-types";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="relative h-[80vh] w-full bg-background flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-muted grid place-items-center opacity-20">
        {/* Video Placeholder */}
        <span className="text-9xl font-bold text-muted-foreground select-none">
          CINEMATIC
        </span>
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

      <div className="relative z-10 text-center space-y-4 max-w-4xl px-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
          {product.name}
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground">
          {product.tagline}
        </p>
      </div>
    </section>
  );
}
