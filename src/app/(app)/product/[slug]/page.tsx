import { ProductHero } from "@/components/product/product-hero";
import { ProductTabs } from "@/components/product/product-tabs";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "products",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const product = docs[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <ProductHero product={product} />
      <ProductTabs product={product} />
      <StickyBuyBar product={product} />
    </div>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs: products } = await payload.find({
    collection: "products",
    select: {
      slug: true,
    },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}
