"use client";

import type { CSSProperties } from "react";
import type { PortfolioMode } from "@/lib/mode";

/**
 * ModeFold — "The Infinity Fold".
 *
 * The Lightswind Hamburger Menu Overlay, repurposed as the core
 * student ⇄ developer transition. The overlay mechanics are the
 * hamburger's: a solid destination-themed sheet whose clip-path
 * circle opens from the exact toggle point, staggered menu-style
 * status lines sliding in from the left.
 *
 *   open   (t≈0–0.48s)   the iris opens from the tap point
 *                        (clip-path circle 0 → 150%, Lightswind's
 *                        hamburger easing); status lines stagger in.
 *   swap   (t≈0.52s)     the new universe mounts silently behind
 *                        the fully-opaque cover.
 *   close  (t≈0.66–1.08s) the status lines slide out and the sheet
 *                        folds back into the exact point it opened
 *                        from — the new reality revealed last at
 *                        the tap point, like a page being turned.
 *
 * The ∞ slide (t≈0.16–0.88s): the glyph enters off the left edge,
 * banks through centre — crossing it exactly as the universe swaps
 * behind the cover — and exits right, two softer echoes trailing.
 * All transform / opacity, driven by mount-safe keyframe animations
 * (a CSS transition can never fire on a freshly-inserted element's
 * first style resolution, so the open phase must be an animation).
 *
 * Under prefers-reduced-motion the whole cycle collapses to a calm
 * crossfade.
 */

export type FoldStage = "idle" | "open" | "close";

export type FoldState = {
  active: boolean;
  target: PortfolioMode;
  origin: { x: number; y: number } | null;
  stage: FoldStage;
};

/** The site's infinity glyph (24×24) — the same path the logo uses. */
const INF_PATH =
  "M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z";

const ITEMS_TO_DEV = [
  "▸ suspending student.env",
  "▸ booting dev.env",
  "▸ compiling interface",
];

const ITEMS_TO_STUDENT = [
  "▸ saving dev.session",
  "▸ waking student.env",
  "▸ unfolding notebook",
];

function InfGlyph({ main }: { main?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {main ? (
        <defs>
          <linearGradient id="foldInfGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--fold-accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--fold-accent-2)" }} />
          </linearGradient>
        </defs>
      ) : null}
      <path
        d={INF_PATH}
        stroke={main ? "url(#foldInfGrad)" : "var(--fold-accent)"}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ModeFold({ fold }: { fold: FoldState }) {
  const { active, target, origin, stage } = fold;
  if (!active || stage === "idle") return null;

  const toDev = target === "dev";
  const items = toDev ? ITEMS_TO_DEV : ITEMS_TO_STUDENT;

  // The iris opens from the toggle point (or dead-centre for a
  // hash-routed fold) — the hamburger overlay's origin mechanics.
  const style = {
    "--fx": origin ? `${origin.x}px` : "50vw",
    "--fy": origin ? `${origin.y}px` : "50vh",
  } as CSSProperties;

  return (
    <div
      className={`fold is-${stage}`}
      data-target={target}
      style={style}
      aria-hidden="true"
    >
      {/* faint scanline texture — static, near-free */}
      <span className="fold-grain" />

      {/* hamburger-style staggered status lines */}
      <ul className="fold-items">
        {items.map((item, i) => (
          <li
            className="fold-item"
            key={item}
            style={{ "--i": i } as CSSProperties}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* the infinity fold — sweeps through the overlay */}
      <div className="fold-inf-track">
        <span className="fold-inf fold-inf-echo-2">
          <InfGlyph />
        </span>
        <span className="fold-inf fold-inf-echo-1">
          <InfGlyph />
        </span>
        <span className="fold-inf fold-inf-main">
          <InfGlyph main />
        </span>
      </div>
    </div>
  );
}
