/** Products shown per /shop/[page]. Shared by the page and its static
 * params so they can never disagree. */
export const SHOP_PAGE_SIZE = 9;

/** Number of shop pages needed to hold `totalDocs` products. */
export function totalShopPages(totalDocs: number): number {
  return Math.ceil(totalDocs / SHOP_PAGE_SIZE);
}

/** Concrete /shop/N paths to revalidate after a catalog change. Goes one
 * page past the current total so a page that just emptied out (or page 1
 * of a now-empty catalog) is purged rather than left stale. */
export function shopPagePaths(totalDocs: number): string[] {
  return Array.from(
    { length: totalShopPages(totalDocs) + 1 },
    (_, i) => `/shop/${i + 1}`,
  );
}
