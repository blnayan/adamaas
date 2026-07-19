import { describe, expect, it } from "vitest";
import { youTubeEmbedUrl } from "./video";

describe("youTubeEmbedUrl", () => {
  it("converts a watch URL to a privacy-enhanced embed URL", () => {
    expect(youTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("converts a youtu.be share link", () => {
    expect(youTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("converts a Shorts link", () => {
    expect(
      youTubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
    ).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("rejects non-YouTube URLs and plain text", () => {
    expect(youTubeEmbedUrl("https://vimeo.com/123456")).toBeNull();
    expect(youTubeEmbedUrl("not a url")).toBeNull();
    expect(youTubeEmbedUrl("https://www.youtube.com/watch")).toBeNull();
  });
});
