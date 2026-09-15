import type { Variant } from "@/lib/cart/cart";
import { ladderKind } from "@/lib/product-variants";

export type FrameColor = {
  id: string;
  label: string;
  /** CSS color for the swatch */
  swatch: string;
  isDefault?: boolean;
};

/** Locked Nomad frame colors — same price across all. */
export const FRAME_COLORS: FrameColor[] = [
  {
    id: "galaxy-black",
    label: "Galaxy Black",
    swatch: "#1a1a1a",
    isDefault: true,
  },
  { id: "army-green", label: "Army Green", swatch: "#4B5320" },
  { id: "navy-blue", label: "Navy Blue", swatch: "#1B2A4A" },
  { id: "white", label: "White", swatch: "#F2F2F2" },
];

export const DEFAULT_FRAME_COLOR =
  FRAME_COLORS.find((c) => c.isDefault) ?? FRAME_COLORS[0];

/** Color picker only for ladder tiers that include a printed frame. */
export function kitNeedsFrameColor(variant?: Variant | null): boolean {
  if (!variant) return false;
  const kind = ladderKind(variant);
  return kind === "frame" || kind === "full" || kind === "ultimate";
}
