import { describe, expect, it } from "vitest";
import { PHONE_REGEX, formatPhoneNumber } from "./phone";

describe("formatPhoneNumber", () => {
  it("returns an empty string for empty input", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  it("leaves 1-3 digits unformatted", () => {
    expect(formatPhoneNumber("5")).toBe("5");
    expect(formatPhoneNumber("555")).toBe("555");
  });

  it("wraps the area code once a 4th digit is typed", () => {
    expect(formatPhoneNumber("5551")).toBe("(555) 1");
    expect(formatPhoneNumber("555123")).toBe("(555) 123");
  });

  it("adds the dash after the 6th digit", () => {
    expect(formatPhoneNumber("5551234")).toBe("(555) 123-4");
    expect(formatPhoneNumber("5551234567")).toBe("(555) 123-4567");
  });

  it("strips non-digit characters before formatting", () => {
    expect(formatPhoneNumber("(555) 123-4567")).toBe("(555) 123-4567");
    expect(formatPhoneNumber("555.123.4567")).toBe("(555) 123-4567");
    expect(formatPhoneNumber("abc555def123")).toBe("(555) 123");
  });

  it("ignores digits past the 10th", () => {
    expect(formatPhoneNumber("555123456789")).toBe("(555) 123-4567");
  });

  it("produces output that satisfies PHONE_REGEX once complete", () => {
    expect(PHONE_REGEX.test(formatPhoneNumber("5551234567"))).toBe(true);
  });
});

describe("PHONE_REGEX", () => {
  it("accepts the canonical format", () => {
    expect(PHONE_REGEX.test("(555) 123-4567")).toBe(true);
  });

  it.each(["5551234567", "555-123-4567", "(555)123-4567", "(555) 123-456"])(
    "rejects %s",
    (value) => {
      expect(PHONE_REGEX.test(value)).toBe(false);
    },
  );
});
