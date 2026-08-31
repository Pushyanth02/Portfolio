import { memo } from "react";
import { PortraitCard } from "./portrait-card";
import { SectionBadge } from "./section-icons";

const LOOK_FOR = [
  "impactful, explainable work",
  "problems worth a whiteboard",
  "talented folks to build with",
];

const FACTS = [
  { k: "based", v: "bangalore, in" },
  { k: "studying", v: "b.tech cs @ lpu ’29 · cgpa 7.98" },
  { k: "stack", v: "ts · next.js · react · node" },
  { k: "focus", v: "local-first · deterministic" },
  { k: "status", v: "open to collab" },
];

/**
 * About — the opening cover of the notebook. The page now starts with the
 * human: editorial cover grid, polaroid portrait, quick facts strip. The
 * polaroid holds the flippable PortraitCard — the portrait photo on the
 * front, the resident infinity doodle on the back (tap to flip).
 */
export const About = memo(function About() {
  return (
    <section className="sec about-cover" id="about" aria-label="About Pushyanth">
      <div className="wrap ac-grid">
        <div className="ac-copy">
          <div className="reveal">
            <SectionBadge id="about" />
          </div>
          <p className="kicker reveal">the human behind the commits</p>
          <h1 className="h2 ac-title">
            <span className="lm">
              <span className="lm-in">What&apos;s his deal?</span>
            </span>
          </h1>
          <p className="reveal" style={{ "--d": ".1s" } as React.CSSProperties}>
            I&apos;m Pushyanth — a computer science undergraduate and full-stack
            developer strong in TypeScript, Next.js, React and modern browser
            APIs. I build local-first web applications, client-side data
            parsing pipelines and deterministic state engines, grounded in
            C/C++ memory work, linear data structures and relational
            databases. Whatever catches my curiosity — AI/ML or cloud — I
            study it hands-first and keep every system explainable.
          </p>
          <p className="reveal" style={{ "--d": ".18s" } as React.CSSProperties}>
            When I&apos;m not shipping, I wander open-source repos, chase new AI
            tooling, and carry the interesting bits back into my own projects.
          </p>
          <ul
            className="lookfor reveal"
            style={{ "--d": ".26s" } as React.CSSProperties}
          >
            {LOOK_FOR.map((t) => (
              <li key={t}>
                <span className="tick">
                  {/* inline check — single-use, avoids an import */}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          <dl
            className="ac-facts reveal"
            style={{ "--d": ".34s" } as React.CSSProperties}
          >
            {FACTS.map((f) => (
              <div className="ac-fact" key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure
          className="ac-fig reveal"
          style={{ "--d": ".15s" } as React.CSSProperties}
        >
          <div className="ac-polaroid">
            <PortraitCard variant="student" />
          </div>
          <figcaption>
            the human ⇄ the resident infinity · tap to flip
          </figcaption>
        </figure>
      </div>
    </section>
  );
});
