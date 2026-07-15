import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addToCart,
  removeFromCart,
  clearCart,
  getCartSnapshot,
  subscribe,
  reconcileWithCatalog,
  resetCartForTests,
} from "./store";
import { makeProduct } from "./test-helpers";

beforeEach(() => {
  localStorage.clear();
  resetCartForTests();
  vi.restoreAllMocks();
});

describe("cart store", () => {
  it("persists changes to localStorage and notifies subscribers", () => {
    const product = makeProduct();
    const listener = vi.fn();
    subscribe(listener);

    addToCart(product);

    expect(getCartSnapshot()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(1);
    expect(listener).toHaveBeenCalled();

    removeFromCart(getCartSnapshot()[0].id);
    expect(getCartSnapshot()).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem("cart")!)).toHaveLength(0);
  });

  it("restores a previously saved cart from localStorage", () => {
    const product = makeProduct();
    addToCart(product);
    const saved = localStorage.getItem("cart");

    resetCartForTests();
    localStorage.setItem("cart", saved!);

    expect(getCartSnapshot()).toHaveLength(1);
    expect(getCartSnapshot()[0].product.id).toBe(product.id);
  });

  it("clearCart empties the cart", () => {
    addToCart(makeProduct());
    clearCart();
    expect(getCartSnapshot()).toEqual([]);
  });
});

describe("reconcileWithCatalog", () => {
  it("removes items that are no longer in the catalog", async () => {
    const kept = makeProduct();
    const removed = makeProduct();
    addToCart(kept);
    addToCart(removed);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ docs: [kept] }),
      }),
    );

    const changed = await reconcileWithCatalog();

    expect(changed).toBe(true);
    expect(getCartSnapshot()).toHaveLength(1);
    expect(getCartSnapshot()[0].product.id).toBe(kept.id);
  });

  it("leaves the cart untouched when the request fails", async () => {
    addToCart(makeProduct());
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const changed = await reconcileWithCatalog();

    expect(changed).toBe(false);
    expect(getCartSnapshot()).toHaveLength(1);
  });

  it("does not fetch at all for an empty cart", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const changed = await reconcileWithCatalog();

    expect(changed).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
