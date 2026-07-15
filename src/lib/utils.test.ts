import { describe, expect, it } from "vitest";
import { cn, generateOrderId } from "./utils";

describe("cn", () => {
  it("merges conditional classes and resolves tailwind conflicts", () => {
    expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4");
  });
});

describe("generateOrderId", () => {
  it("returns a numeric snowflake string", () => {
    expect(generateOrderId()).toMatch(/^\d+$/);
  });

  it("never repeats, even for calls within the same millisecond", () => {
    const ids = Array.from({ length: 1000 }, () => generateOrderId());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("generates monotonically increasing ids", () => {
    const a = BigInt(generateOrderId());
    const b = BigInt(generateOrderId());
    expect(b > a).toBe(true);
  });
});
