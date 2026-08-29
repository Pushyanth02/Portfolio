"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClientEffects } from "@/components/site/client-effects";
import { Rover } from "@/components/site/rover";
import { Header } from "@/components/site/header";
import { Marquee } from "@/components/site/marquee";
import { Beliefs } from "@/components/site/beliefs";
import { Tech } from "@/components/site/tech";
import { Work } from "@/components/site/work";
import { SideQuests } from "@/components/site/side-quests";
import { About } from "@/components/site/about";
import { Connect } from "@/components/site/connect";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { ResumeModal } from "@/components/site/resume-modal";
import { ModeFold, type FoldState } from "@/components/site/mode-fold";

import { DevHero } from "@/components/dev/dev-hero";
import { DevLaws } from "@/components/dev/dev-laws";
import { DevTech } from "@/components/dev/dev-tech";
import { DevWork } from "@/components/dev/dev-work";
import { DevQuests } from "@/components/dev/dev-quests";
import { DevAbout } from "@/components/dev/dev-about";
import { DevConnect } from "@/components/dev/dev-connect";
import { DevDock } from "@/components/dev/dev-dock";

import {
  applyMode,
  normalizeMode,
  readStoredMode,
  type PortfolioMode,
} from "@/lib/mode";
import { notifyWarpBegin, notifyWarpEnd } from "@/components/site/lazy-mount";

const STUDENT_MARQUEE = [
  "code • eat • sleep • repeat",
  "infinity",
  "225 commits & counting",
  "ai-native workflows",
  "pushyanth02",
  "dsa daily",
  "open-source explorer",
  "local-first forever",
];

const STUDENT_MARQUEE_GREEN = [
  "everything ships with care",
  "ai-assisted · deterministic · auditable",
  "no black boxes",
  "build in the open",
  "code • eat • sleep • repeat",
];

const DEV_MARQUEE = [
  "$ npm run ship",
  "git push --force-with-lease",
  "ai-native workflows",
  "deterministic by design",
  "local-first forever",
  "open source maximalism",
  "pushyanth02",
  "zero black boxes",
];

const DEV_MARQUEE_GREEN = [
  "every build reproducible",
  "telemetry: none",
  "exit code 0",
  "$ sudo make me a portfolio",
  "ship in public",
];

export default function Home() {
  // Two entirely different websites sharing one URL. The student surface is
  // the default; the dev surface is a dark terminal universe. Switching
  // folds reality through ModeFold — "The Infinity Fold".
  const [mode, setMode] = useState<PortfolioMode>("student");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [fold, setFold] = useState<FoldState>({
    active: false,
    target: "student",
    origin: null,
    stage: "idle",
  });

  // Latest-value refs so callbacks/timeouts never read stale state. Synced in
  // an effect (not during render) per react-hooks/refs; every consumer runs
  // long after commit, so the one-frame lag is inconsequential.
  const modeRef = useRef(mode);
  const foldRef = useRef(fold);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    modeRef.current = mode;
    foldRef.current = fold;
  }, [mode, fold]);

  // Pick up a persisted / hash-addressed mode once on mount (no fold on
  // first paint — the page just boots in the right universe). The swap must
  // happen post-mount: SSR renders "student", so a lazy initializer would
  // hydration-mismatch.
  useEffect(() => {
    const stored = readStoredMode();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== modeRef.current) setMode(stored);
    else applyMode(stored);
  }, []);

  // Reflect the mode everywhere it lives: <html> class, storage, URL hash.
  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  const clearFoldTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => clearFoldTimers, [clearFoldTimers]);

  // Freeze the page while folding between universes.
  useEffect(() => {
    if (fold.active) {
      document.body.classList.add("folding");
      return () => document.body.classList.remove("folding");
    }
  }, [fold.active]);

  /** The Infinity Fold — one page-turn between universes. */
  const beginFold = useCallback(
    (target: PortfolioMode, origin: { x: number; y: number } | null) => {
      if (foldRef.current.active || target === modeRef.current) return;
      clearFoldTimers();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setFold({ active: true, target, origin, stage: "open" });

      if (reduced) {
        // Reduced motion: a quick, calm crossfade — no theatrics.
        notifyWarpBegin();
        timersRef.current.push(
          window.setTimeout(() => {
            setMode(target);
            window.scrollTo({ top: 0, behavior: "auto" });
          }, 120),
          window.setTimeout(
            () => setFold((f) => ({ ...f, stage: "close" })),
            200
          ),
          window.setTimeout(
            () => {
              setFold({
                active: false,
                target,
                origin: null,
                stage: "idle",
              });
              notifyWarpEnd();
            },
            600
          )
        );
        return;
      }

      // The iris needs ~380ms to cover the stage; the canvas fields tear
      // down only once the cover can hide the pop. The ∞ slide owns the
      // centre of attention by then.
      // t=520ms: the new universe mounts silently behind the opaque cover.
      // t=660ms: the fold closes back into its origin, page-turn style.
      // t=1120ms: done — 28% faster than the old ripple-led fold.
      timersRef.current.push(
        window.setTimeout(() => notifyWarpBegin(), 380),
        window.setTimeout(() => {
          setMode(target);
          window.scrollTo({ top: 0, behavior: "auto" });
        }, 520),
        window.setTimeout(
          () => setFold((f) => ({ ...f, stage: "close" })),
          660
        ),
        window.setTimeout(
          () => {
            setFold({
              active: false,
              target,
              origin: null,
              stage: "idle",
            });
            notifyWarpEnd();
          },
          1120
        )
      );
    },
    [clearFoldTimers]
  );

  // #dev / #student links are shareable — a manual hash edit folds through
  // the overlay too (origin: screen centre).
  useEffect(() => {
    const onHashChange = () => {
      if (foldRef.current.active) return;
      const fromHash = normalizeMode(window.location.hash.replace(/^#/, ""));
      if (fromHash) beginFold(fromHash, null);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [beginFold]);

  const toggleFromLogo = useCallback(
    (e?: React.MouseEvent) => {
      const origin = e ? { x: e.clientX, y: e.clientY } : null;
      beginFold(modeRef.current === "student" ? "dev" : "student", origin);
    },
    [beginFold]
  );

  useEffect(() => {
    const handleOpen = () => setResumeOpen(true);
    window.addEventListener("open-resume", handleOpen);
    return () => window.removeEventListener("open-resume", handleOpen);
  }, []);

  const isDev = mode === "dev";

  return (
    <>
      {/* keyed by mode: a mode switch remounts the tree, and the fresh
          ClientEffects instance re-observes the new .reveal/.lm/.tilt nodes */}
      <ClientEffects key={`fx-${mode}`} />
      {/* keyed by mode: the header's scrollspy and the rover's dock hold
          refs to section DOM that a fold replaces — remounting rebinds them */}
      <Header
        key={`head-${mode}`}
        onOpenResume={() => setResumeOpen(true)}
        mode={mode}
        onToggleMode={toggleFromLogo}
      />
      <main id="top" key={`main-${mode}`} className={isDev ? "dv-main" : ""}>
        {isDev ? (
          <>
            {/* Strict section parity with the student surface:
                about → hero → marquee → work → stack → laws → quests →
                connect. The dev universe reads the same page, darker. */}
            <DevAbout />
            <DevHero />
            <Marquee variant="green" items={DEV_MARQUEE} />
            <DevWork />
            <DevTech />
            <DevLaws />
            <DevQuests />
            <DevConnect />
          </>
        ) : (
          <>
            {/* The notebook opens on the human — about first, by design.
                The retired "Build with AI / Ship with certainty" thesis
                band now lives only in the dev universe (dv-thesis); the
                student surface gets straight to the work. */}
            <About />
            <Marquee items={STUDENT_MARQUEE} />
            <Work />
            <Tech />
            <Beliefs />
            <SideQuests />
            <Connect />
          </>
        )}
      </main>
      <Marquee
        variant="green"
        items={isDev ? DEV_MARQUEE_GREEN : STUDENT_MARQUEE_GREEN}
      />
      <Footer />
      <BackToTop />
      {/* Each universe has its own wayfinder: the student surface has the
          roaming Rover mascot; the dev surface navigates via the Docker-style
          DevDock. Both remount with their mode. */}
      {isDev ? (
        <DevDock key="dock-dev" onToggleMode={toggleFromLogo} />
      ) : (
        <Rover key="rover-student" />
      )}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <ModeFold fold={fold} />
    </>
  );
}
