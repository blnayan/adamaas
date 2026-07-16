import { ProductCard } from "@/components/shop/product-card";
import { Product } from "@/payload-types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {products.map((product, index) => (
        // The first row (3 columns on desktop) is above the fold; its images
        // are LCP candidates and must not be lazy-loaded.
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  );
}
