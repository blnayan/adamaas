import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function ShopPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 9;

  const payload = await getPayload({ config });

  // Fetch bundle separately
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

  const {
    docs: otherProducts,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = productsData;

  return (
    <div className="min-h-screen bg-background">
      {/* Bundle Hero Section */}
      {bundle && (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center bg-card border-b border-border">
          {/* Placeholder for Bundle Hero Image/Video */}
          <div className="absolute inset-0 bg-background grid place-items-center opacity-50">
            <div className="text-muted-foreground font-bold text-6xl md:text-9xl opacity-20 select-none">
              BUNDLE
            </div>
          </div>

          <div className="container relative z-10 px-4 md:px-8 max-w-screen-2xl">
            <div className="max-w-2xl space-y-6">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 border-none text-md px-3 py-1">
                Best Value
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter">
                {bundle.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {bundle.tagline}
              </p>
              <p className="text-lg text-muted-foreground max-w-lg">
                {bundle.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={`/shop/${bundle.slug}`}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg font-semibold h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Buy Ecosystem Bundle - ${bundle.basePrice}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="py-20 container px-4 md:px-8 max-w-screen-2xl">
        <h2 className="text-3xl font-bold mb-10 text-foreground">
          Our Products
        </h2>

        {otherProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {otherProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  {hasPrevPage && (
                    <PaginationItem>
                      <PaginationPrevious href={`/shop?page=${page - 1}`} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={`/shop?page=${i + 1}`}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {hasNextPage && (
                    <PaginationItem>
                      <PaginationNext href={`/shop?page=${page + 1}`} />
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
