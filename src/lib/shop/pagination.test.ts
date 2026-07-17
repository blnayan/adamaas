import { describe, expect, it } from "vitest";
import { SHOP_PAGE_SIZE, shopPagePaths, totalShopPages } from "./pagination";

describe("totalShopPages", () => {
  it("returns 0 pages for an empty catalog", () => {
    expect(totalShopPages(0)).toBe(0);
  });

  it("fits a partial page", () => {
    expect(totalShopPages(1)).toBe(1);
    expect(totalShopPages(SHOP_PAGE_SIZE - 1)).toBe(1);
  });

  it("rolls over exactly at page-size boundaries", () => {
    expect(totalShopPages(SHOP_PAGE_SIZE)).toBe(1);
    expect(totalShopPages(SHOP_PAGE_SIZE + 1)).toBe(2);
    expect(totalShopPages(SHOP_PAGE_SIZE * 3)).toBe(3);
  });
});

describe("shopPagePaths", () => {
  it("still returns page 1 for an empty catalog, so it re-renders as empty", () => {
    expect(shopPagePaths(0)).toEqual(["/shop/1"]);
  });

  it("includes one page past the end, purging a page that just emptied", () => {
    expect(shopPagePaths(1)).toEqual(["/shop/1", "/shop/2"]);
  });

  it("enumerates every current page plus the trailing one", () => {
    expect(shopPagePaths(SHOP_PAGE_SIZE + 1)).toEqual([
      "/shop/1",
      "/shop/2",
      "/shop/3",
    ]);
  });
});
