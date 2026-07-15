import { describe, expect, it } from "vitest";
import { formatLongDate, formatUsd, formatUsdFromCents } from "./format";

describe("formatUsd", () => {
  it("formats whole dollars with cents", () => {
    expect(formatUsd(89)).toBe("$89.00");
  });

  it("formats fractional amounts", () => {
    expect(formatUsd(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatUsd(0)).toBe("$0.00");
  });
});

describe("formatUsdFromCents", () => {
  it("converts Stripe cent amounts to dollars", () => {
    expect(formatUsdFromCents(123450)).toBe("$1,234.50");
    expect(formatUsdFromCents(0)).toBe("$0.00");
    expect(formatUsdFromCents(99)).toBe("$0.99");
  });
});

describe("formatLongDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(formatLongDate("2026-07-15T12:00:00.000Z")).toBe("July 15, 2026");
  });
});
