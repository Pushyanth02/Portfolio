import { memo } from "react";
import { TECHNOLOGIES, TECH_TOTAL, TOOLS } from "@/lib/tech";
import PrismGrid from "@/components/originkit/prism-grid";
import { Icon } from "./icons";
import { LazyMount } from "./lazy-mount";
import { SectionBadge } from "./section-icons";

/**
 * Tech — the dedicated Technologies section (extracted from the resume's
 * SKILLS SUMMARY), repurposing the old "AI Workbench" slot. Four compact
 * category rows with staggered chip pop-ins; the 13 daily-driver AI tools
 * ride along as a compact footnote strip so nothing from the old workbench
 * is lost. Behind it: an Originkit Prism Grid — a tilted field of warm
 * prismatic cells that light under the pointer (the arsenal, refracted).
 * The content column lets pointer events fall through to the field except
 * on the interactive chips.
 */
export const Tech = memo(function Tech() {
  return (
    <section className="sec tech-sec" id="stack">
      {/* Originkit — Prism Grid (pointer-reactive tilted cell field),
          lazy-mounted, warm palette on the notebook paper */}
      <div className="tech-bg" aria-hidden="true">
        <LazyMount delay={200}>
          <PrismGrid
            colors={["#E8603C", "#F2B33D", "#3E7C4F", "#FBF6EC", "#E9D9BC"]}
            boxSize={46}
            maxCols={22}
            maxRows={22}
            tilt={{ x: 24, y: 0 }}
            borderWidth={1}
            borderColor="rgba(32, 26, 20, 0.09)"
            fadeDuration={1}
          />
        </LazyMount>
      </div>

      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="stack" />
        </div>
        <p className="kicker reveal">the arsenal</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">Technologies I ship with.</span>
          </span>
        </h2>
        <p
          className="tech-sub reveal"
          style={{ "--d": ".1s" } as React.CSSProperties}
        >
          Pulled straight off the resume: languages, frameworks, backend &amp;
          the platform tooling that gets ideas from <b>init</b> to{" "}
          <b>deploy</b>. Hands-on, project-proven, zero padding.
        </p>

        <div className="tech-grid">
          {TECHNOLOGIES.map((c, ci) => (
            <div
              className="tech-cat reveal"
              key={c.id}
              style={{ "--d": `${0.08 + ci * 0.08}s` } as React.CSSProperties}
            >
              <header className="tech-cat-head">
                <h3>{c.label}</h3>
                <span className="tech-cat-hint">{c.hint}</span>
                <span className="tech-cat-rule" aria-hidden="true" />
              </header>
              <ul className="tech-chips">
                {c.items.map((t, i) => (
                  <li
                    className="tech-chip"
                    key={t}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="tech-ai reveal"
          style={{ "--d": ".2s" } as React.CSSProperties}
        >
          <p className="tech-ai-label">
            <span aria-hidden="true">+</span> the ai workbench riding shotgun
          </p>
          <ul className="tech-ai-row">
            {TOOLS.map((t) => (
              <li key={t.name}>
                <Icon name={t.icon} /> {t.name}
              </li>
            ))}
          </ul>
        </div>

        <p
          className="bench-note reveal"
          style={{ "--d": ".3s" } as React.CSSProperties}
        >
          {TECH_TOTAL} technologies · {TOOLS.length} ai copilots · from the
          resume, hands-on
        </p>
      </div>
    </section>
  );
});
