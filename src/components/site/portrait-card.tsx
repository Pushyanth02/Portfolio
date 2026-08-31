"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/utils";

/**
 * PortraitCard — the about figure in both universes.
 *
 * Two faces stacked in one square card: Pushyanth's portrait sits on the
 * front (i.e. "above"), and the in-house drawn resident infinity doodle
 * lives on the back. A click / Enter / Space flips the card between them.
 *
 * The flip animation is deliberately different per mode — same component,
 * two personalities:
 *  · student ("pcard-student") — a springy side-hinge paper-craft turn
 *    (rotateY with an overshoot curve + a little polaroid bounce)
 *  · dev     ("pcard-dev")     — a terminal "swap" — top-hinge rotateX
 *    under a one-shot CRT scanline/glitch flash in phosphor green
 *
 * Reduced motion: the rotation transition and glitch/bounce keyframes
 * are disabled — the faces still swap instantly (the state change is the
 * feature; the movement is garnish).
 */

const FLIP_MS = 720;

export function PortraitCard({
  variant,
}: {
  variant: "student" | "dev";
}) {
  const [flipped, setFlipped] = useState(false);
  // One-shot window during the turn — drives the dev glitch flash and the
  // student polaroid bounce while the rotation transition runs.
  const [flipping, setFlipping] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const toggle = () => {
    setFlipped((f) => !f);
    setFlipping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlipping(false), FLIP_MS);
  };

  const root = `pcard pcard-${variant}${flipped ? " is-flipped" : ""}${
    flipping ? " is-flipping" : ""
  }`;

  const eager = variant === "student"; // the student cover sits above the fold

  return (
    <div className={root}>
      <button
        type="button"
        className="pcard-btn"
        onClick={toggle}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? "Flip back to the portrait photo of Pushyanth"
            : "Flip to the resident infinity doodle"
        }
      >
        <span className="pcard-face pcard-front">
          <img
            src={assetUrl("/art/portrait.webp")}
            alt="Portrait photo of Pushyanth"
            width={720}
            height={720}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : undefined}
            sizes="(max-width: 960px) min(440px, 100vw), 33vw"
          />
        </span>
        <span className="pcard-face pcard-back">
          <img
            src={assetUrl("/art/doodle.webp")}
            alt="The resident infinity — an infinity symbol with eyes, a graduation cap and a laptop, drawn in-house"
            width={720}
            height={720}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 960px) min(440px, 100vw), 33vw"
          />
        </span>
      </button>
      {/* dev-only: the CRT flash that sweeps the turn (see dev.css) */}
      {variant === "dev" && <span className="pcard-glitch" aria-hidden="true" />}
    </div>
  );
}
