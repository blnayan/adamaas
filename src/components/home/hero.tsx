import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Background Placeholder - In a real scenario, this would be a <video> element */}
      <div className="absolute inset-0 z-0 bg-background grid place-items-center">
        <div className="text-muted-foreground font-bold text-9xl opacity-20 select-none">
          VIDEO
        </div>
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tighter max-w-4xl">
          Adamaas Hardware that works.{" "}
          <span className="block text-primary">
            Built in-house. Shipped fast.
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/shop">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
            >
              SHOP PRODUCTS
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg h-14 px-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none"
            >
              HIRE FOR PROTOTYPING
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
