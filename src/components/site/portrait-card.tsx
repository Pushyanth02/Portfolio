"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/utils";

/**
 * PortraitCard — the about figure in both universes.
 *
 * Two faces stacked in one square card: Pushyanth's portrait sits on the
 * front (i.e. "above"), and the in-house drawn resident infinity doodle
 * lives on the back. A click / Enter / Space flips the card between them.
 *
 * v3 — THE COIN TOSS (one-shot ~1.08s choreography, driven by the
 * `is-flipping` window + `data-dir` so each direction plays its own arc):
 *  · student ("pcard-student") — THE COIN TOSS: the card is launched
 *    upward like a flicked coin, tumbles end-over-end (rotateX arc),
 *    catches a metallic glint at the edge-on apex, and bounce-lands
 *    with a springy overshoot. A drop-shadow pulse breathes underneath.
 *  · dev     ("pcard-dev")     — THE PHOSPHOR SWAP: the card hinges up to
 *    nearly edge-on and HESITATES (the terminal "changing reels"), a CRT
 *    scanline roll + phosphor flash floods the frame, then it snaps
 *    through with an overshoot — like a monitor re-rendering its face.
 *
 * Reduced motion: the choreography collapses — the faces still swap
 * instantly (the state change is the feature; the movement is garnish).
 */


export function PortraitCard({
  variant,
}: {
  variant: "student" | "dev";
}) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    setFlipped((f) => !f);
  };

  const root = `pcard pcard-${variant}${flipped ? " is-flipped" : ""}`;

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
    </div>
  );
}
