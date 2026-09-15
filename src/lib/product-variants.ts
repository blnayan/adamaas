import type { Variant } from "@/lib/cart/cart";

export type LadderKind = "frame" | "electronics" | "full" | "ultimate" | "other";

/** Add-ons sit below the kit ladder (battery / O4), never as peers of Full/Ultimate. */
export function isAddOnVariant(variant: Variant): boolean {
  const n = variant.name.toLowerCase();
  if (n.includes("ultimate")) return false;
  return (
    n.includes("battery") ||
    n.includes("auline") ||
    n.includes("o4") ||
    n.includes("air unit")
  );
}

export function ladderKind(variant: Variant): LadderKind {
  const n = variant.name.toLowerCase();
  if (n.includes("ultimate")) return "ultimate";
  if (n.includes("full")) return "full";
  if (n.includes("electronics")) return "electronics";
  if (n.includes("frame")) return "frame";
  return "other";
}

const LADDER_ORDER: Record<LadderKind, number> = {
  frame: 0,
  electronics: 1,
  full: 2,
  ultimate: 3,
  other: 9,
};

export function partitionProductVariants(variants: Variant[] | null | undefined) {
  const list = variants ?? [];
  const addOns: Variant[] = [];
  const ladder: Variant[] = [];
  for (const v of list) {
    if (isAddOnVariant(v)) addOns.push(v);
    else ladder.push(v);
  }
  ladder.sort(
    (a, b) => LADDER_ORDER[ladderKind(a)] - LADDER_ORDER[ladderKind(b)],
  );
  // Ladder + add-ons layout when we have a real kit step-up or any add-ons.
  const useLadder = ladder.length >= 2 || addOns.length > 0;
  return { ladder, addOns, useLadder };
}

/** Inclusion matrix cells for the four kit tiers. */
export function ladderMatrixCell(
  kind: LadderKind,
  row: "frame" | "electronics" | "pack" | "o4",
): string {
  const table: Record<
    Exclude<LadderKind, "other">,
    Record<"frame" | "electronics" | "pack" | "o4", string>
  > = {
    frame: { frame: "✓", electronics: "", pack: "", o4: "" },
    electronics: { frame: "", electronics: "✓", pack: "", o4: "" },
    full: { frame: "✓", electronics: "✓", pack: "1×", o4: "" },
    ultimate: { frame: "✓", electronics: "✓", pack: "4×", o4: "✓" },
  };
  if (kind === "other") return "";
  return table[kind][row];
}
