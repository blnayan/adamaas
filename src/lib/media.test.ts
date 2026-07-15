import { describe, expect, it } from "vitest";
import type { Media } from "@/payload-types";
import { resolveImage, resolveImageOrFallback } from "./media";

function makeMedia(overrides: Partial<Media> = {}): Media {
  return {
    id: 1,
    alt: "A drone",
    url: "/media/drone.jpg",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("resolveImage", () => {
  it("resolves a populated media document", () => {
    expect(resolveImage(makeMedia())).toEqual({
      url: "/media/drone.jpg",
      alt: "A drone",
    });
  });

  it("returns null for null or undefined", () => {
    expect(resolveImage(null)).toBeNull();
    expect(resolveImage(undefined)).toBeNull();
  });

  it("returns null for an unpopulated relation (bare id)", () => {
    expect(resolveImage(7)).toBeNull();
  });

  it("returns null when the media has no url", () => {
    expect(resolveImage(makeMedia({ url: null }))).toBeNull();
  });

  it("uses the fallback alt when the media alt is empty", () => {
    expect(resolveImage(makeMedia({ alt: "" }), "Reaper")).toEqual({
      url: "/media/drone.jpg",
      alt: "Reaper",
    });
  });
});

describe("resolveImageOrFallback", () => {
  it("passes through a resolvable image", () => {
    expect(resolveImageOrFallback(makeMedia(), "x")).toEqual({
      url: "/media/drone.jpg",
      alt: "A drone",
    });
  });

  it("falls back to the site logo when unresolvable", () => {
    expect(resolveImageOrFallback(null, "My Post")).toEqual({
      url: "/Adamaas_Logo_v2.jpg",
      alt: "My Post",
    });
  });
});
