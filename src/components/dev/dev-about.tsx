import { memo } from "react";
import { assetUrl } from "@/lib/utils";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";

const LOOK_FOR = [
  "impactful, explainable work",
  "problems worth a whiteboard",
  "talented folks to build with",
];

const WHOAMI = [
  ["user", "pushyanth (pushyanth02)"],
  ["role", "cs student · software crafter"],
  ["shell", "/bin/build-with-ai"],
  ["editor", "vs code + claude code"],
  ["location", "bangalore, in · UTC+5:30"],
  ["uptime", "shipping daily"],
];

const BOOT = [
  "[ ok ] mounting /dev/creativity",
  "[ ok ] sourcing core.config.ts: 3 laws loaded",
  "[ ok ] linking 78 resonances · 5 tyrants",
  "$ whoami",
];

/**
 * DevAbout — the terminal boots here. `whoami` + about.md in a window,
 * preceded by a quick boot log so the section reads like a power-on
 * sequence. First section of the dev surface (about first in both modes).
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

        <div className="dv-boot reveal" aria-hidden="true">
          {BOOT.map((l, i) => (
            <p
              className="dv-boot-line"
              key={l}
              style={{ "--d": `${i * 0.09}s` } as React.CSSProperties}
            >
              {l}
            </p>
          ))}
        </div>

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
                pushyanth here. cs student, software crafter. i build with AI
                and keep my systems explainable. days go to data structures
                and algorithms, evenings to full-stack builds with AI
                copilots in the loop.
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
              <img
                src={assetUrl("/art/doodle.webp")}
                alt="Illustrated doodle avatar: an infinity symbol with eyes, a graduation cap and a laptop"
                width={720}
                height={720}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 960px) min(320px, 80vw), 300px"
              />
            </div>
            <figcaption>
              <span className="dv-dim">$</span> cat avatar.png{" "}
              <span className="dv-dim">· the resident infinity</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
});
