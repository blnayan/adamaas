/** US phone number in the shape the contact form produces: (555) 123-4567. */
export const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/;

export const PHONE_FORMAT_MESSAGE =
  "Phone number must be in the format (xxx) xxx-xxxx";

/**
 * Progressively format a US phone number as the user types.
 * Non-digits are stripped, then grouped as (xxx) xxx-xxxx; anything past
 * ten digits is ignored.
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
