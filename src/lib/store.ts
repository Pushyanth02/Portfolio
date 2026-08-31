import { create } from "zustand";
import { applyMode, normalizeMode, readStoredMode, type PortfolioMode } from "./mode";
import { notifyWarpBegin, notifyWarpEnd } from "@/components/site/lazy-mount";

/**
 * PortfolioStore — the single source of truth for cross-cutting UI state.
 *
 * What lives here (and why):
 *   • mode            — which universe is mounted (student ⇄ dev)
 *   • fold            — the Infinity Fold overlay orchestration (timers,
 *                       stages, warp notifications) — previously scattered
 *                       across page-level refs and effects
 *   • resumeOpen      — the resume modal (previously an `open-resume`
 *                       CustomEvent + window listener; now a typed action)
 *   • contactOpen     — the contact-form dialog
 *   • *EverOpened     — "mount-on-first-open" flags so modals can be
 *                       dynamically imported and still animate out cleanly
 *
 * Components subscribe with narrow selectors (`useStore(s => s.mode)`)
 * so a fold stage tick never re-renders a static section.
 */

export type FoldStage = "idle" | "open" | "close";

export type FoldState = {
  active: boolean;
  target: PortfolioMode;
  origin: { x: number; y: number } | null;
  stage: FoldStage;
};

const IDLE_FOLD: FoldState = {
  active: false,
  target: "student",
  origin: null,
  stage: "idle",
};

type PortfolioStore = {
  mode: PortfolioMode;
  hydrated: boolean;
  hydrate: () => void;
  fold: FoldState;
  beginFold: (target: PortfolioMode, origin: { x: number; y: number } | null) => void;
  resumeOpen: boolean;
  resumeEverOpened: boolean;
  openResume: () => void;
  closeResume: () => void;
  contactOpen: boolean;
  contactEverOpened: boolean;
  openContact: () => void;
  closeContact: () => void;
};

/* Fold timers are module-scoped plain state — outside React so stage
   transitions never depend on render timing or stale closures. */
let foldTimers: number[] = [];

const clearFoldTimers = () => {
  foldTimers.forEach((t) => window.clearTimeout(t));
  foldTimers = [];
};

/* The #dev / #student shareable hash listener is registered exactly once,
   on the first hydrate() call (client-side by definition). */
let hashListenerBound = false;

export const usePortfolioStore = create<PortfolioStore>()((set, get) => ({
  mode: "student",
  hydrated: false,
  fold: IDLE_FOLD,

  hydrate: () => {
    if (get().hydrated) return;
    set({ hydrated: true });

    // Boot into the persisted / hash-addressed universe without folding.
    // applyMode always runs so <html.dev>, localStorage and the URL hash
    // stay in sync whichever branch booted the mode.
    const stored = readStoredMode();
    if (stored !== get().mode) set({ mode: stored });
    applyMode(stored);

    if (!hashListenerBound) {
      hashListenerBound = true;
      window.addEventListener("hashchange", () => {
        if (get().fold.active) return;
        const fromHash = normalizeMode(window.location.hash.replace(/^#/, ""));
        if (fromHash) get().beginFold(fromHash, null);
      });
    }
  },

  /** The Infinity Fold — one page-turn between universes. */
  beginFold: (target, origin) => {
    const { fold, mode } = get();
    if (fold.active || target === mode) return;
    clearFoldTimers();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () =>
      set({ fold: { ...IDLE_FOLD, target } });
    const swap = () => {
      set({ mode: target });
      applyMode(target);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    set({ fold: { active: true, target, origin, stage: "open" } });

    if (reduced) {
      // Reduced motion: a quick, calm crossfade — no theatrics.
      notifyWarpBegin();
      foldTimers = [
        window.setTimeout(swap, 120),
        window.setTimeout(() => set({ fold: { ...get().fold, stage: "close" } }), 200),
        window.setTimeout(() => {
          finish();
          notifyWarpEnd();
        }, 600),
      ];
      return;
    }

    // The iris needs ~380ms to cover the stage; canvas fields tear down
    // only once the cover can hide the pop. The ∞ slide owns the centre
    // of attention by then.
    // t=520ms: the new universe mounts silently behind the opaque cover.
    // t=660ms: the fold closes back into its origin, page-turn style.
    // t=1120ms: done.
    foldTimers = [
      window.setTimeout(() => notifyWarpBegin(), 380),
      window.setTimeout(swap, 520),
      window.setTimeout(() => set({ fold: { ...get().fold, stage: "close" } }), 660),
      window.setTimeout(() => {
        finish();
        notifyWarpEnd();
      }, 1120),
    ];
  },

  resumeOpen: false,
  resumeEverOpened: false,
  openResume: () => set({ resumeOpen: true, resumeEverOpened: true }),
  closeResume: () => set({ resumeOpen: false }),

  contactOpen: false,
  contactEverOpened: false,
  openContact: () => set({ contactOpen: true, contactEverOpened: true }),
  closeContact: () => set({ contactOpen: false }),
}));

/** Toggle helper — derives the fold target from the current mode. */
export function toggleModeFromEvent(e?: React.MouseEvent) {
  const { mode, beginFold } = usePortfolioStore.getState();
  beginFold(mode === "student" ? "dev" : "student", e ? { x: e.clientX, y: e.clientY } : null);
}
