"use client";

import { useEffect, useState } from "react";
import HoverImageReveal, {
  type HoverImageRevealProps,
} from "@/components/originkit/hover-image-reveal";

/**
 * CertRevealView — a thin responsive shell around the (otherwise verbatim)
 * Originkit Hover Image Reveal. It scales the floating certificate window
 * down on narrow viewports so the WHOLE certificate fits inside the reveal
 * stage on any device, and hands every other prop straight through.
 *
 * It renders <HoverImageReveal> directly — no extra wrapper div — so the
 * existing `.cert-reveal > div > div:first-child` window styling (sticker
 * frame in student.css-land / phosphor frame in dev) keeps matching.
 *
 * Width is derived from the live viewport (minus the page wrap + window
 * chrome the caller reserves via `viewportMargin`); height keeps the
 * caller's base aspect ratio. Until the first client measure, the base
 * desktop size is used (the window is invisible before any hover, so the
 * swap is never seen).
 */
export type CertRevealViewProps = HoverImageRevealProps & {
  /** Floating window width at desktop and up. */
  baseWidth: number;
  /** Floating window height at desktop and up (sets the window aspect). */
  baseHeight: number;
  /** Viewport edges to reserve (page wrap padding + window chrome). */
  viewportMargin?: number;
};

export default function CertRevealView({
  baseWidth,
  baseHeight,
  viewportMargin = 64,
  ...rest
}: CertRevealViewProps) {
  const [vw, setVw] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const available =
    vw == null ? baseWidth : Math.max(200, vw - viewportMargin);
  const width = Math.min(baseWidth, available);
  const height = Math.round((width / baseWidth) * baseHeight);

  // explicit imageWidth/imageHeight come AFTER the spread so the computed
  // responsive window size always wins
  return (
    <HoverImageReveal {...rest} imageWidth={width} imageHeight={height} />
  );
}
