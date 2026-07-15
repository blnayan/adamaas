/** Public origin of the site, used to build absolute redirect URLs. */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
}
