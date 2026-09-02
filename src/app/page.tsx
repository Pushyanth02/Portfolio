"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ClientEffects } from "@/components/site/client-effects";
import { Header } from "@/components/site/header";
import { PrismBackground } from "@/components/site/prism-background";
import { Marquee } from "@/components/site/marquee";
import { Work } from "@/components/site/work";
import { About } from "@/components/site/about";
import { Connect } from "@/components/site/connect";
import { Footer } from "@/components/site/footer";
import { ModeFold } from "@/components/site/mode-fold";
import { ModeAnnouncer } from "@/components/site/mode-announcer";

/* Below-fold sections are code-split: they load only after the hero
   and first viewport content are painted, cutting the initial bundle. */
const Beliefs = dynamic(
  () => import("@/components/site/beliefs").then((m) => m.Beliefs),
  { ssr: false }
);
const Tech = dynamic(
  () => import("@/components/site/tech").then((m) => m.Tech),
  { ssr: false }
);
const Certificates = dynamic(
  () => import("@/components/site/certificates").then((m) => m.Certificates),
  { ssr: false }
);

import { DevHero } from "@/components/dev/dev-hero";
import { DevLaws } from "@/components/dev/dev-laws";
import { DevTech } from "@/components/dev/dev-tech";
import { DevWork } from "@/components/dev/dev-work";
import DevCertificates from "@/components/dev/dev-certificates";
import { DevAbout } from "@/components/dev/dev-about";
import { DevConnect } from "@/components/dev/dev-connect";

import { usePortfolioStore } from "@/lib/store";

/* Heavy / late-mounting surfaces are code-split: the dialogs load their
   chunks only on first open ("mount-on-first-open" via *EverOpened flags
   in the store), and the wayfinders load after first paint. */
const Rover = dynamic(() => import("@/components/site/rover").then((m) => m.Rover), {
  ssr: false,
});
const StudentDock = dynamic(
  () => import("@/components/site/student-dock").then((m) => m.StudentDock),
  { ssr: false }
);
const DevDock = dynamic(
  () => import("@/components/dev/dev-dock").then((m) => m.DevDock),
  { ssr: false }
);
const ResumeModal = dynamic(
  () => import("@/components/site/resume-modal").then((m) => m.ResumeModal),
  { ssr: false }
);
const ContactFormDialog = dynamic(
  () => import("@/components/site/contact-form").then((m) => m.ContactFormDialog),
  { ssr: false }
);

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
  // folds reality through ModeFold — "The Infinity Fold". All cross-cutting
  // state (mode, fold, dialogs) lives in the portfolio store.
  const mode = usePortfolioStore((s) => s.mode);
  const fold = usePortfolioStore((s) => s.fold);
  const hydrate = usePortfolioStore((s) => s.hydrate);
  const resumeOpen = usePortfolioStore((s) => s.resumeOpen);
  const resumeEverOpened = usePortfolioStore((s) => s.resumeEverOpened);
  const closeResume = usePortfolioStore((s) => s.closeResume);
  const contactEverOpened = usePortfolioStore((s) => s.contactEverOpened);

  // Pick up a persisted / hash-addressed mode once on mount (no fold on
  // first paint — the page just boots in the right universe) and bind the
  // shareable #dev / #student hash listener.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Freeze the page while folding between universes.
  useEffect(() => {
    if (fold.active) {
      document.body.classList.add("folding");
      return () => document.body.classList.remove("folding");
    }
  }, [fold.active]);

  const isDev = mode === "dev";

  return (
    <>
      {/* the Originkit Prism Grid — one fixed field behind everything,
          alive in both universes (palette swaps in place on fold) */}
      <PrismBackground />
      {/* keyed by mode: a mode switch remounts the tree, and the fresh
          ClientEffects instance re-observes the new .reveal/.lm/.tilt nodes */}
      <ClientEffects key={`fx-${mode}`} />
      <Header />
      <main id="top" key={`main-${mode}`} className={isDev ? "dv-main" : ""}>
        {isDev ? (
          <>
            {/* Strict section parity with the student surface:
                about → hero → marquee → work → stack → laws → certs →
                connect. The dev universe reads the same page, darker. */}
            <DevAbout />
            <DevHero />
            <Marquee variant="green" items={DEV_MARQUEE} />
            <DevWork />
            <DevTech />
            <DevLaws />
            <DevCertificates />
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
            <Certificates />
            <Connect />
          </>
        )}
      </main>
      <Marquee
        variant="green"
        items={isDev ? DEV_MARQUEE_GREEN : STUDENT_MARQUEE_GREEN}
      />
      <Footer />
      {/* Each universe now navigates with the same icon dock — the student
          surface keeps its roaming Rover mascot AND gets the sticker-shelf
          StudentDock (same items/icons/scrollspy as the DevDock); the dev
          surface navigates via the terminal-skinned DevDock. Both load
          lazily and remount with their mode. */}
      {isDev ? (
        <DevDock key="dock-dev" />
      ) : (
        <>
          <Rover key="rover-student" />
          <StudentDock key="dock-student" />
        </>
      )}
      {/* Mount-on-first-open: the modal chunks stay out of the initial
          bundle and still animate out cleanly after they've loaded. */}
      {resumeEverOpened && (
        <ResumeModal isOpen={resumeOpen} onClose={closeResume} />
      )}
      {contactEverOpened && <ContactFormDialog />}
      <ModeFold fold={fold} />
      <ModeAnnouncer />
    </>
  );
}
