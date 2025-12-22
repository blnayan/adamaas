import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Snowflake} from "@sapphire/snowflake"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId() {
  return new Snowflake(new Date(process.env.SNOWFLAKE_EPOCH || "2000-01-01T00:00:00.000Z")).generate().toString();
}
