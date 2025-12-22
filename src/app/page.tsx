import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Hero />
      <FeaturedCarousel />
    </div>
  );
}
