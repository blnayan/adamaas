import { afterEach, describe, expect, it, vi } from "vitest";
import { startCheckout } from "./client";
import { makeProduct } from "@/lib/cart/test-helpers";
import type { CartItem } from "@/lib/cart/cart";

function makeItems(): CartItem[] {
  const product = makeProduct({
    id: 1,
    variants: [{ id: "v1", name: "RTF", price: 549 }],
  });
  return [
    { id: "1-RTF", product, variant: product.variants![0], quantity: 2 },
  ];
}

function mockFetch(response: Partial<Response> & { json?: () => unknown }) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    ...response,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("startCheckout", () => {
  it("posts productId/variantName/quantity only — never prices", async () => {
    const fetchMock = mockFetch({
      json: async () => ({ url: "https://checkout.stripe.com/session" }),
    });

    await startCheckout(makeItems());

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/checkout");
    expect(JSON.parse(init.body)).toEqual({
      items: [{ productId: 1, variantName: "RTF", quantity: 2 }],
    });
  });

  it("returns the redirect url on success", async () => {
    mockFetch({
      json: async () => ({ url: "https://checkout.stripe.com/session" }),
    });

    await expect(startCheckout(makeItems())).resolves.toEqual({
      status: "redirect",
      url: "https://checkout.stripe.com/session",
    });
  });

  it("maps 409 to cart-outdated", async () => {
    mockFetch({ ok: false, status: 409 });

    await expect(startCheckout(makeItems())).resolves.toEqual({
      status: "cart-outdated",
    });
  });

  it("maps other failures to error", async () => {
    mockFetch({ ok: false, status: 500 });

    await expect(startCheckout(makeItems())).resolves.toEqual({
      status: "error",
    });
  });

  it("treats a malformed success payload as an error", async () => {
    mockFetch({ json: async () => ({ url: "not-a-url" }) });

    await expect(startCheckout(makeItems())).resolves.toEqual({
      status: "error",
    });
  });

  it("treats a network failure as an error instead of throwing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(startCheckout(makeItems())).resolves.toEqual({
      status: "error",
    });
  });
});
