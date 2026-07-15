/** Products shown per /shop/[page]. Shared by the page and its static
 * params so they can never disagree. */
export const SHOP_PAGE_SIZE = 9;

/** Number of shop pages needed to hold `totalDocs` products. */
export function totalShopPages(totalDocs: number): number {
  return Math.ceil(totalDocs / SHOP_PAGE_SIZE);
}
