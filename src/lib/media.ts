import type { Media } from "@/payload-types";

export interface ResolvedImage {
  url: string;
  alt: string;
}

/**
 * Resolve a Payload upload field to a renderable image. Upload fields are
 * `number | Media | null` depending on depth, and `Media.url` is optional,
 * so every consumer needs the same narrowing — do it once here.
 */
export function resolveImage(
  value: number | Media | null | undefined,
  fallbackAlt = "",
): ResolvedImage | null {
  if (!value || typeof value === "number" || !value.url) return null;
  return { url: value.url, alt: value.alt || fallbackAlt };
}

/** Resolve a Payload upload field to a downloadable URL, with the same
 * narrowing as {@link resolveImage} but no alt handling. */
export function resolveFileUrl(
  value: number | Media | null | undefined,
): string | null {
  if (!value || typeof value === "number" || !value.url) return null;
  return value.url;
}

const FALLBACK_IMAGE_URL = "/Adamaas_Logo_v2.jpg";

/** Like {@link resolveImage}, but falls back to the site logo instead of
 * null — for slots that must always render an image (blog cards/heroes). */
export function resolveImageOrFallback(
  value: number | Media | null | undefined,
  fallbackAlt = "",
): ResolvedImage {
  return (
    resolveImage(value, fallbackAlt) ?? {
      url: FALLBACK_IMAGE_URL,
      alt: fallbackAlt,
    }
  );
}
