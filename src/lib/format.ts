const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format a dollar amount for display, e.g. 1234.5 -> "$1,234.50". */
export function formatUsd(dollars: number): string {
  return usd.format(dollars);
}

/** Format a Stripe integer cent amount, e.g. 123450 -> "$1,234.50". */
export function formatUsdFromCents(cents: number): string {
  return formatUsd(cents / 100);
}

/** Format an ISO date string as e.g. "July 15, 2026". */
export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
