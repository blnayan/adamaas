import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./contact-form";

const validInquiry = {
  customerName: "Ada Lovelace",
  projectName: "Analytical Engine",
  timeline: "Q4",
  email: "ada@example.com",
  phone: "(555) 123-4567",
  description: "A mechanical general-purpose computer.",
};

describe("contactFormSchema", () => {
  it("accepts a fully valid inquiry", () => {
    expect(contactFormSchema.safeParse(validInquiry).success).toBe(true);
  });

  it.each([
    ["customerName", "A", "too-short name"],
    ["projectName", "X", "too-short project name"],
    ["timeline", "", "empty timeline"],
    ["email", "not-an-email", "invalid email"],
    ["phone", "5551234567", "unformatted phone"],
    ["description", "too short", "description under 10 chars"],
  ])("rejects %s = %j (%s)", (field, value) => {
    const result = contactFormSchema.safeParse({
      ...validInquiry,
      [field]: value,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual([field]);
    }
  });

  it("rejects a payload with a missing field", () => {
    const rest: Partial<typeof validInquiry> = { ...validInquiry };
    delete rest.email;
    expect(contactFormSchema.safeParse(rest).success).toBe(false);
  });
});
