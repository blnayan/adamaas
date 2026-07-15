const VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Cloudflare Turnstile token server-side. Returns whether the
 * token is valid; network failures propagate to the caller.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const response = await fetch(VERIFY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY || "",
      response: token,
    }),
  });
  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
