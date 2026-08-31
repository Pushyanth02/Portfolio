"use client";

import PrismGrid from "@/components/originkit/prism-grid";
import { usePortfolioStore } from "@/lib/store";

/**
 * PrismBackground — the Originkit "Prism Grid" mounted as the living
 * background of the page, in BOTH universes.
 *
 * The Originkit component is integrated exactly as provided — one
 * instance, unmodified, rendered straight from
 * `@/components/originkit/prism-grid` with its documented props. This
 * wrapper only positions it (a fixed, full-viewport layer behind all
 * content — see `.prism-field` in globals.css) and hands it the
 * per-universe palette:
 *
 *   · student — the warm notebook prism (coral / sun / leaf / paper /
 *     sand) with faint ink grid lines, the same palette the arsenal
 *     section pioneered.
 *   · dev     — the phosphor terminal prism (green / mint / pale
 *     phosphor-white with coral & sun accents) with faint green lines;
 *     the whole field is dimmed via `.prism-field` opacity so lit
 *     cells read as terminal blips instead of white flashes.
 *
 * Interactivity: the grid lights cells under the pointer wherever the
 * document lets pointer events fall through to this layer (the
 * pointer-events map in globals.css keeps every real interactive
 * element — links, buttons, cards, chips, docks — fully clickable).
 * The instance is deliberately NOT keyed by mode: folding swaps the
 * palette props in place under the fold cover, so the grid geometry
 * and measurements survive the universe turn without a re-measure.
 */

/** Student universe — warm prism on notebook paper. */
const STUDENT_PRISM = [
  "#E8603C", // coral
  "#F2B33D", // sun
  "#3E7C4F", // leaf
  "#FBF6EC", // paper white
  "#E9D9BC", // sand
];

/** Dev universe — phosphor prism on the terminal. */
const DEV_PRISM = [
  "#7EE787", // phosphor green
  "#A8F0C6", // mint
  "#EAF6EE", // pale phosphor white
  "#F2B33D", // sun accent
  "#E8603C", // coral accent
];

const STUDENT_BORDER = "rgba(32, 26, 20, 0.09)";
const DEV_BORDER = "rgba(126, 231, 135, 0.16)";

export function PrismBackground() {
  const mode = usePortfolioStore((s) => s.mode);
  const isDev = mode === "dev";

  return (
    <div className="prism-field" aria-hidden="true">
      <PrismGrid
        colors={isDev ? DEV_PRISM : STUDENT_PRISM}
        boxSize={46}
        maxCols={22}
        maxRows={22}
        tilt={{ x: 24, y: 0 }}
        borderWidth={1}
        borderColor={isDev ? DEV_BORDER : STUDENT_BORDER}
        fadeDuration={1}
      />
    </div>
  );
}
