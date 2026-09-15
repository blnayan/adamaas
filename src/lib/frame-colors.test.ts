import { describe, expect, it } from "vitest";
import { kitNeedsFrameColor } from "./frame-colors";

describe("kitNeedsFrameColor", () => {
  it("requires color on frame / full / ultimate only", () => {
    expect(kitNeedsFrameColor({ name: "Printed Frame", price: 29 })).toBe(true);
    expect(kitNeedsFrameColor({ name: "Full Kit", price: 299 })).toBe(true);
    expect(kitNeedsFrameColor({ name: "Ultimate", price: 559 })).toBe(true);
    expect(kitNeedsFrameColor({ name: "Electronics Kit", price: 229 })).toBe(
      false,
    );
    expect(
      kitNeedsFrameColor({ name: "Auline V45 Battery Pack", price: 44 }),
    ).toBe(false);
    expect(kitNeedsFrameColor({ name: "DJI O4 Air Unit", price: 139 })).toBe(
      false,
    );
  });
});
