import { PRODUCTS } from "@/lib/data";
import { ProductHero } from "@/components/product/product-hero";
import { ProductTabs } from "@/components/product/product-tabs";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { notFound } from "next/navigation";

// Next.js 15+ correct type for params
type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = PRODUCTS.find((p) => p.slug === slug);

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
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}
