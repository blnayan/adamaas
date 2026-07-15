import { describe, it, expect } from "vitest";
import {
  addItem,
  removeItem,
  cartTotal,
  itemCount,
  reconcileCart,
  parseStoredCart,
} from "./cart";
import { makeProduct } from "./test-helpers";

describe("addItem", () => {
  it("adds a product to an empty cart with quantity 1", () => {
    const product = makeProduct();

    const cart = addItem([], product);

    expect(cart).toHaveLength(1);
    expect(cart[0].product).toEqual(product);
    expect(cart[0].quantity).toBe(1);
  });

  it("increments quantity when the same product is added again", () => {
    const product = makeProduct();

    const cart = addItem(addItem([], product), product);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("keeps different variants of the same product as separate lines", () => {
    const product = makeProduct({
      variants: [
        { name: "Frame Only", price: 89 },
        { name: "RTF", price: 549 },
      ],
    });

    let cart = addItem([], product, product.variants![0]);
    cart = addItem(cart, product, product.variants![1]);
    cart = addItem(cart, product, product.variants![1]);

    expect(cart).toHaveLength(2);
    expect(cart[0].variant?.name).toBe("Frame Only");
    expect(cart[0].quantity).toBe(1);
    expect(cart[1].variant?.name).toBe("RTF");
    expect(cart[1].quantity).toBe(2);
  });
});

describe("removeItem", () => {
  it("removes only the line with the given id", () => {
    const a = makeProduct();
    const b = makeProduct();
    const cart = addItem(addItem([], a), b);

    const result = removeItem(cart, cart[0].id);

    expect(result).toHaveLength(1);
    expect(result[0].product.id).toBe(b.id);
  });
});

describe("cartTotal and itemCount", () => {
  it("uses the variant price when present, otherwise the base price", () => {
    const plain = makeProduct({ basePrice: 100 });
    const withVariants = makeProduct({
      basePrice: 89,
      variants: [{ name: "RTF", price: 549 }],
    });

    let cart = addItem([], plain);
    cart = addItem(cart, plain); // 2 x 100
    cart = addItem(cart, withVariants, withVariants.variants![0]); // 1 x 549

    expect(cartTotal(cart)).toBe(749);
    expect(itemCount(cart)).toBe(3);
  });
});

describe("reconcileCart", () => {
  it("drops items whose product is no longer in the catalog", () => {
    const kept = makeProduct();
    const removed = makeProduct();
    const cart = addItem(addItem([], kept), removed);

    const result = reconcileCart(cart, [kept]);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].product.id).toBe(kept.id);
    expect(result.changed).toBe(true);
  });

  it("refreshes stale product data while preserving quantity", () => {
    const stale = makeProduct({ basePrice: 100, name: "Old Name" });
    const cart = addItem(addItem([], stale), stale); // qty 2
    const updated = { ...stale, basePrice: 150, name: "New Name" };

    const result = reconcileCart(cart, [updated]);

    expect(result.items[0].product.basePrice).toBe(150);
    expect(result.items[0].product.name).toBe("New Name");
    expect(result.items[0].quantity).toBe(2);
    expect(result.changed).toBe(true);
  });

  it("reports no change when the catalog matches the cart", () => {
    const product = makeProduct();
    const cart = addItem([], product);

    const result = reconcileCart(cart, [product]);

    expect(result.items).toEqual(cart);
    expect(result.changed).toBe(false);
  });

  it("drops items whose variant no longer exists on the product", () => {
    const product = makeProduct({
      variants: [
        { name: "Frame Only", price: 89 },
        { name: "RTF", price: 549 },
      ],
    });
    let cart = addItem([], product, product.variants![0]);
    cart = addItem(cart, product, product.variants![1]);

    const updated = { ...product, variants: [{ name: "RTF", price: 549 }] };
    const result = reconcileCart(cart, [updated]);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].variant?.name).toBe("RTF");
    expect(result.changed).toBe(true);
  });

  it("refreshes the variant price when it changed in the catalog", () => {
    const product = makeProduct({
      variants: [{ name: "RTF", price: 549 }],
    });
    const cart = addItem([], product, product.variants![0]);

    const updated = { ...product, variants: [{ name: "RTF", price: 599 }] };
    const result = reconcileCart(cart, [updated]);

    expect(result.items[0].variant?.price).toBe(599);
    expect(cartTotal(result.items)).toBe(599);
    expect(result.changed).toBe(true);
  });
});

describe("parseStoredCart", () => {
  it("round-trips a serialized cart", () => {
    const product = makeProduct({
      variants: [{ name: "RTF", price: 549 }],
    });
    const cart = addItem([], product, product.variants![0]);

    expect(parseStoredCart(JSON.stringify(cart))).toEqual(cart);
  });

  it("returns an empty cart for missing, malformed, or wrong-shape data", () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart("not json{")).toEqual([]);
    expect(parseStoredCart(JSON.stringify({ hello: "world" }))).toEqual([]);
    expect(
      parseStoredCart(JSON.stringify([{ id: "1", quantity: "lots" }])),
    ).toEqual([]);
  });
});
