import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function Home() {
  const payload = await getPayload({ config });
  const { docs: products } = await payload.find({
    collection: "products",
    where: {
      type: {
        equals: "product",
      },
    },
    limit: 3,
    sort: "-createdAt",
  });

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <Hero />
      <FeaturedCarousel products={products} />
    </div>
  );
}
