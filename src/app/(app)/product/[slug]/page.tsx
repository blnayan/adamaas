import { ProductHero } from "@/components/product/product-hero";
import { ProductTabs } from "@/components/product/product-tabs";
import { productJsonLd, productMetadata } from "@/lib/product-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { cache } from "react";
import config from "@payload-config";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// Hourly ISR keeps prerendered product pages in sync with catalog changes —
// product edits no longer revalidate pages on demand.
export const revalidate = 3600;

// cache() dedupes the query between generateMetadata and the page render.
const getProductBySlug = cache(async (slug: string) => {
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
  return docs[0];
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? productMetadata(product) : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <ProductHero product={product} />
      <ProductTabs product={product} />
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
