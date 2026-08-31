import { memo } from "react";
import { TECHNOLOGIES, TECH_TOTAL, TOOLS } from "@/lib/tech";
import { Icon } from "./icons";
import { SectionBadge } from "./section-icons";

/**
 * Tech — the dedicated Technologies section (extracted from the resume's
 * SKILLS SUMMARY), repurposing the old "AI Workbench" slot. Four compact
 * category rows with staggered chip pop-ins; the 13 daily-driver AI tools
 * ride along as a compact footnote strip so nothing from the old workbench
 * is lost. The Originkit Prism Grid that used to live behind this section
 * now renders as the page-wide living background (PrismBackground) —
 * same component, same palette, positioned behind both universes.
 */
export const Tech = memo(function Tech() {
  return (
    <section className="sec tech-sec" id="stack">
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
