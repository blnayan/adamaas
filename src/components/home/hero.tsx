import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    // offset matches the navbar: h-16 (4rem) plus its 1px bottom border
    <section className="relative min-h-[calc(100svh-4rem-1px)] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-background">
        <video
          className="h-full w-full object-cover"
          src="/hero-background.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-background/75" />
      </div>

      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tighter max-w-4xl">
          ADAMAAS Hardware that works.{" "}
          <span className="block text-primary">
            Built in-house. Shipped fast.
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/shop/1">
            <Button
              size="lg"
              className="w-full sm:w-auto font-semibold text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              SHOP PRODUCTS
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto font-semibold text-lg h-14 px-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              HIRE FOR PROTOTYPING
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
