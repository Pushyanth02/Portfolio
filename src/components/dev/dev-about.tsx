import { memo } from "react";
import { PortraitCard } from "@/components/site/portrait-card";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";

const LOOK_FOR = [
  "impactful, explainable work",
  "problems worth a whiteboard",
  "talented folks to build with",
];

const WHOAMI = [
  ["user", "pushyanth (pushyanth02)"],
  ["role", "cs undergrad · full-stack developer"],
  ["core", "typescript · next.js · react · web apis"],
  ["focus", "local-first · deterministic · explainable"],
  ["shell", "/bin/build-with-ai"],
  ["editor", "vs code + claude code"],
  ["location", "bangalore, in · UTC+5:30"],
  ["uptime", "shipping daily"],
];

/**
 * DevAbout — the terminal boots here. `whoami` + about.md in a window.
 * (The dmesg-style boot-log strip was removed with the other lore lines —
 * the surface opens straight on the prompt.) The figure beside the window
 * is the flippable PortraitCard: the portrait on the front, the resident
 * infinity on the back, turning on a top hinge under a phosphor flash.
 * First section of the dev surface (about first in both modes).
 */
export const DevAbout = memo(function DevAbout() {
  return (
    <section className="sec" id="about" aria-label="About — developer mode">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="about" />
        </div>
        <p className="kicker reveal">$ whoami</p>
        <h1 className="h2">
          <span className="lm">
            <span className="lm-in">What&apos;s his deal?</span>
          </span>
        </h1>

        <div className="dv-about-grid">
          <DevWindow title="pushyanth — 120×32" prompt="whoami && cat about.md">
            <div className="dv-code">
              {WHOAMI.map(([k, v]) => (
                <p className="dv-line" key={k}>
                  <span className="dv-prop">{k}</span>
                  <span className="dv-dim"> = </span>
                  <span className="dv-str">&quot;{v}&quot;</span>
                </p>
              ))}
            </div>
            <div className="dv-md">
              <p>
                pushyanth here. cs undergrad, full-stack developer. strong in
                typescript, next.js, react and modern browser apis — i build
                local-first web apps, client-side parsing pipelines and
                deterministic state engines, grounded in c/c++ memory work,
                linear data structures and relational databases.
              </p>
              <p>
                off-hours: wandering open-source repos, testing new AI
                tooling, folding the good parts back into my own projects.
              </p>
              <p className="dv-md-looking" aria-label="looking for">
                <span className="dv-line-comment">{"// currently looking for"}</span>
              </p>
              <ul className="dv-checklist">
                {LOOK_FOR.map((t) => (
                  <li key={t}>
                    <span className="dv-check" aria-hidden="true">
                      [x]
                    </span>{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </DevWindow>

          <figure className="dv-about-fig reveal" style={{ "--d": ".15s" } as React.CSSProperties}>
            <div className="dv-about-frame">
              <PortraitCard variant="dev" />
            </div>
            <figcaption>
              <span className="dv-dim">$</span> cat me.png ⇄ infinity.webp
              <span className="dv-dim"> · the resident infinity · click to flip</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
});
