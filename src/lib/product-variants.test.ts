import { describe, expect, it } from "vitest";
import {
  isAddOnVariant,
  ladderKind,
  partitionProductVariants,
} from "./product-variants";

describe("product-variants", () => {
  it("classifies O4 and Auline as add-ons, not Ultimate", () => {
    expect(isAddOnVariant({ name: "DJI O4 Air Unit", price: 139 })).toBe(true);
    expect(
      isAddOnVariant({ name: "Auline V45 Battery Pack", price: 44 }),
    ).toBe(true);
    expect(isAddOnVariant({ name: "Ultimate", price: 559 })).toBe(false);
    expect(isAddOnVariant({ name: "Full Kit", price: 299 })).toBe(false);
  });

  it("orders the kit ladder Frame → Electronics → Full → Ultimate", () => {
    const { ladder, addOns, useLadder } = partitionProductVariants([
      { name: "Ultimate", price: 559 },
      { name: "DJI O4 Air Unit", price: 139 },
      { name: "Printed Frame", price: 29 },
      { name: "Auline V45 Battery Pack", price: 44 },
      { name: "Full Kit", price: 299, isDefault: true },
      { name: "Electronics Kit", price: 229 },
    ]);
    expect(useLadder).toBe(true);
    expect(ladder.map((v) => v.name)).toEqual([
      "Printed Frame",
      "Electronics Kit",
      "Full Kit",
      "Ultimate",
    ]);
    expect(addOns.map((v) => v.name)).toEqual([
      "DJI O4 Air Unit",
      "Auline V45 Battery Pack",
    ]);
    expect(ladderKind(ladder[2])).toBe("full");
  });
});
