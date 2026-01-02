import { getPayload } from "payload";
import config from "@payload-config";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ShopHero } from "@/components/shop/shop-hero";
import { ProductGrid } from "@/components/shop/product-grid";
import { notFound } from "next/navigation";

type ShopPaginatedPageProps = {
  params: Promise<{ page: string }>;
};

export default async function ShopPaginatedPage({
  params,
}: ShopPaginatedPageProps) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  const limit = 9;

  if (isNaN(page) || page < 1) {
    notFound();
  }

  const payload = await getPayload({ config });

  // Fetch bundle separately (could be cached or passed, but fetching here matches pattern)
  const { docs: bundles } = await payload.find({
    collection: "products",
    where: {
      type: {
        equals: "bundle",
      },
    },
    limit: 1,
  });
  const bundle = bundles[0];

  // Fetch individual products
  const productsData = await payload.find({
    collection: "products",
    where: {
      type: {
        equals: "product",
      },
    },
    limit,
    page,
    sort: "-createdAt",
  });

  const { docs: products, totalPages, hasNextPage, hasPrevPage } = productsData;

  if (products.length === 0 && page > 1) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Bundle Hero Section - Only show on page 1? Or all? Usually all for shop consistency. page.tsx shows it. */}
      {bundle && <ShopHero bundle={bundle} />}

      {/* Product Grid */}
      <section className="py-20 container px-4 md:px-8 max-w-screen-2xl">
        <h2 className="text-3xl font-bold mb-10 text-foreground">
          Our Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  {hasPrevPage && (
                    <PaginationItem>
                      <PaginationPrevious href={`/shop/${page - 1}`} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/shop/${p}`}
                          isActive={page === p}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {hasNextPage && (
                    <PaginationItem>
                      <PaginationNext href={`/shop/${page + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const limit = 9;

  const { totalDocs } = await payload.count({
    collection: "products",
    where: {
      type: {
        equals: "product",
      },
    },
  });

  const totalPages = Math.ceil(totalDocs / limit);

  return Array.from({ length: totalPages }).map((_, i) => ({
    page: (i + 1).toString(),
  }));
}
