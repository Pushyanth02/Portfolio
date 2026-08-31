/**
 * Portfolio mode — one site, two surfaces.
 *
 *   "student"  the default: warm "sticker notebook" portfolio.
 *   "dev"      the same portfolio rendered as a dark, terminal-driven
 *              developer skin (Text Morph + Liquid Glass from Originkit).
 *
 * The mode lives in page-level state, is persisted to localStorage and
 * mirrored into the URL hash (#dev) so a developer-mode link is shareable.
 * `html.dev` is the CSS hook the whole dark design system scopes under.
 */

export type PortfolioMode = "student" | "dev";

const MODE_STORAGE_KEY = "pf-mode";
const MODE_HASH: Record<PortfolioMode, string> = {
  student: "#student",
  dev: "#dev",
};

export function normalizeMode(value: unknown): PortfolioMode | null {
  return value === "dev" || value === "student" ? value : null;
}

/** Read the initial mode from the URL hash, then localStorage. */
export function readStoredMode(): PortfolioMode {
  if (typeof window === "undefined") return "student";
  const fromHash = normalizeMode(window.location.hash.replace(/^#/, ""));
  if (fromHash) return fromHash;
  try {
    return normalizeMode(window.localStorage.getItem(MODE_STORAGE_KEY)) ?? "student";
  } catch {
    return "student";
  }
}

/** Persist + reflect the mode: localStorage, URL hash, `html.dev` class. */
export function applyMode(mode: PortfolioMode) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* private mode — ignore */
  }
  document.documentElement.classList.toggle("dev", mode === "dev");
  const target = mode === "dev" ? MODE_HASH.dev : window.location.pathname + window.location.search;
  history.replaceState(null, "", target);
}
