"use client";

import { useEffect } from "react";

// <model-viewer> is a custom element, not a React component — teach JSX the
// tag and the attributes we use, once, here.
declare module "react" {
  // Augmenting JSX.IntrinsicElements requires the namespace form.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        "ios-src"?: string;
        poster?: string;
        alt?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "shadow-intensity"?: string;
        "touch-action"?: string;
      };
    }
  }
}

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  poster?: string;
  alt: string;
  // "pan-y" lets vertical swipes keep scrolling the page (inline embeds);
  // "none" gives the viewer every finger (fullscreen overlays).
  touchAction?: "pan-y" | "none";
  // AR's launch badge needs a corner to live in — turn it off in embeds
  // whose corners are already spoken for.
  ar?: boolean;
}

export function ModelViewer({
  src,
  iosSrc,
  poster,
  alt,
  touchAction = "pan-y",
  ar = true,
}: ModelViewerProps) {
  // The library registers the custom element and boots a three.js renderer —
  // browser-only, so it loads on mount instead of at module scope (client
  // components still render on the server, and only this slide pays for it).
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      ios-src={ar ? iosSrc : undefined}
      poster={poster}
      alt={alt}
      ar={ar || undefined}
      ar-modes={ar ? "webxr scene-viewer quick-look" : undefined}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      touch-action={touchAction}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
