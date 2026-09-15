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
            ADAMAAS designs and builds unmanned aircraft systems for defense and
            commercial customers — NDAA-focused hardware, engineered in-house,
            shipped without the fluff.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-4xl font-bold mb-4">Nick</h2>
          <p>
            Founder and engineer. Obsessed with efficiency, durability, and
            getting working airframes into the field fast.
          </p>
          <p className="text-xl font-medium not-prose mt-8">
            Hardware that works. Built in-house. Shipped fast.
          </p>
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
