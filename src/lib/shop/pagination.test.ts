import { describe, expect, it } from "vitest";
import { SHOP_PAGE_SIZE, totalShopPages } from "./pagination";

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
