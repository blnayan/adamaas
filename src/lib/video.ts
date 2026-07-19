const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

/**
 * Convert a YouTube link (watch, youtu.be share, or Shorts URL) to a
 * privacy-enhanced embed URL. Returns null for anything that isn't a
 * recognizable YouTube video link, so callers can hide the embed instead
 * of rendering a broken iframe.
 */
export function youTubeEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  let videoId: string | null = null;
  if (parsed.hostname === "youtu.be") {
    videoId = parsed.pathname.slice(1);
  } else if (YOUTUBE_HOSTS.has(parsed.hostname)) {
    const shortsMatch = parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/);
    videoId = shortsMatch?.[1] ?? parsed.searchParams.get("v");
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}
