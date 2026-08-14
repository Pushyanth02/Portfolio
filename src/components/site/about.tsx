import { assetUrl } from "@/lib/utils";

const LOOK_FOR = [
  "impactful, explainable work",
  "problems worth a whiteboard",
  "talented folks to build with",
];

export function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap about-grid">
        <div className="about-copy">
          <p className="kicker reveal">the human behind the commits</p>
          <h2 className="h2"><span className="lm"><span className="lm-in">What&apos;s his deal?</span></span></h2>
          <p className="reveal" style={{ "--d": ".1s" } as React.CSSProperties}>
            I&apos;m Pushyanth — a computer science student &amp; software crafter who builds with AI and keeps
            his systems explainable. Days go to data structures &amp; algorithms; evenings go to
            full-stack builds with Claude, Codex &amp; friends in the loop; curiosity goes to AI/ML
            and cloud — studied hands-first, explained always.
          </p>
          <p className="reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
            When I&apos;m not shipping, I&apos;m exploring open-source repos, chasing new AI tooling,
            and bringing the interesting bits back into my own projects.
          </p>
          <ul className="lookfor reveal" style={{ "--d": ".3s" } as React.CSSProperties}>
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
        </div>
        <figure className="about-img reveal" style={{ "--d": ".15s" } as React.CSSProperties}>
          <img
            src={assetUrl("/art/doodle.webp")}
            alt="Illustrated doodle avatar: an infinity symbol with eyes, a graduation cap and a laptop"
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
          />
          <figcaption>the resident infinity · drawn in-house</figcaption>
        </figure>
      </div>
    </section>
  );
}
