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
 * v2 — the immersive turns (one-shot ~1.05s choreography, driven by the
 * `is-flipping` window + `data-dir` so each direction plays its own arc):
 *  · student ("pcard-student") — THE POLAROID TOSS: the card is plucked
 *    off the page toward the viewer, swings a wobbly side-hinge arc
 *    (rotateY + a drunk rotateZ drift + scale breathing), a paper-glare
 *    sweep crosses the surface mid-flight, and it settles with a springy
 *    overshoot while the polaroid shadow pulses underneath.
 *  · dev     ("pcard-dev")     — THE PHOSPHOR SWAP: the card hinges up to
 *    nearly edge-on and HESITATES (the terminal "changing reels"), a CRT
 *    scanline roll + phosphor flash floods the frame, then it snaps
 *    through with an overshoot — like a monitor re-rendering its face.
 *
 * Reduced motion: the choreography collapses — the faces still swap
 * instantly (the state change is the feature; the movement is garnish).
 */

const FLIP_MS = 1080;

export function PortraitCard({
  variant,
}: {
  variant: "student" | "dev";
}) {
  const [flipped, setFlipped] = useState(false);
  // One-shot window during the turn — drives the choreography keyframes
  // (the dev phosphor flash, the student toss arc) while they run.
  const [flipping, setFlipping] = useState(false);
  const [dir, setDir] = useState<"to-back" | "to-front">("to-back");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const toggle = () => {
    setFlipped((f) => {
      const next = !f;
      setDir(next ? "to-back" : "to-front");
      return next;
    });
    setFlipping(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlipping(false), FLIP_MS);
  };

  const root = `pcard pcard-${variant}${flipped ? " is-flipped" : ""}${
    flipping ? " is-flipping" : ""
  }`;

  const eager = variant === "student"; // the student cover sits above the fold

  return (
    <div className={root} data-dir={flipping ? dir : undefined}>
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
        {/* student-only: the paper glare that sweeps the mid-flight surface
            (see student.css) — dev keeps its phosphor glitch overlay below */}
        {variant === "student" && (
          <span className="pcard-glare" aria-hidden="true" />
        )}
      </button>
      {/* dev-only: the CRT scanline roll + phosphor flash (see dev.css) */}
      {variant === "dev" && <span className="pcard-glitch" aria-hidden="true" />}
    </div>
  );
}
