import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * Shared server-side Stripe client. Lazily constructed so importing this
 * module never throws at build time when the key is absent.
 */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    client = new Stripe(key);
  }
  return client;
}
