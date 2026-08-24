"use client";

import { useState, useEffect } from "react";
import { ClientEffects } from "@/components/site/client-effects";
import { Rover } from "@/components/site/rover";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Beliefs } from "@/components/site/beliefs";
import { Workbench } from "@/components/site/workbench";
import { Work } from "@/components/site/work";
import { SideQuests } from "@/components/site/side-quests";
import { About } from "@/components/site/about";
import { Connect } from "@/components/site/connect";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { ResumeModal } from "@/components/site/resume-modal";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setResumeOpen(true);
    window.addEventListener("open-resume", handleOpen);
    return () => window.removeEventListener("open-resume", handleOpen);
  }, []);

  return (
    <>
      <ClientEffects />
      <Header onOpenResume={() => setResumeOpen(true)} />
      <main id="top">
        <Hero />
        <Marquee
          items={[
            "code • eat • sleep • repeat",
            "infinity",
            "utc +5:30",
            "225 commits & counting",
            "ai-native workflows",
            "pushyanth02",
            "dsa daily",
            "open-source explorer",
          ]}
        />
        <Beliefs />
        <Workbench />
        <Work />
        <SideQuests />
        <About />
        <Connect />
      </main>
      <Marquee
        variant="green"
        items={[
          "everything ships with care",
          "ai-assisted · deterministic · auditable",
          "no black boxes",
          "build in the open",
          "code • eat • sleep • repeat",
        ]}
      />
      <Footer />
      <BackToTop />
      <Rover />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
