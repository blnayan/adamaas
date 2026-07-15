import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Snowflake } from "@sapphire/snowflake";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A single generator so the per-instance increment counter survives across
// calls — a fresh instance per call would restart it at 0 and could hand two
// same-millisecond orders the same id.
let snowflake: Snowflake | null = null;

export function generateOrderId() {
  snowflake ??= new Snowflake(
    new Date(process.env.SNOWFLAKE_EPOCH || "2000-01-01T00:00:00.000Z"),
  );
  return snowflake.generate().toString();
}
