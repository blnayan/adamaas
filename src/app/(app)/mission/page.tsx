import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MissionPage() {
  return (
    <div className="bg-background py-20 px-4">
      <div className="container max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Mission
          </h1>
          <p className="text-xl text-muted-foreground">
            Why we build, how we build, and who we build for.
          </p>
        </div>

        <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-muted-foreground">
              Founder Photo / Workspace Photo Placeholder
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-4xl font-bold mb-4">Philosophy</h2>
          <p>
            We believe in open-source hardware. Every frame we design is
            available for free download because innovation shouldn't be
            paywalled. We sell the convenience of pre-built, tuned, and tested
            systems so you can spend less time soldering and more time flying.
          </p>
          <br />
          <h2 className="text-4xl font-bold mb-4">The Engineer</h2>
          <p>Nick - I'm an engineer obsessed with efficiency and durability.</p>
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/shop/1">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Check out the Hardware
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
