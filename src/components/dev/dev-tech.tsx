import { memo } from "react";
import { TECHNOLOGIES, TECH_TOTAL, TOOLS } from "@/lib/tech";
import { Icon } from "@/components/site/icons";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";
import LiquidGrid from "@/components/originkit/liquid-grid";
import { LazyMount } from "@/components/site/lazy-mount";

/**
 * DevTech — the technologies from the resume, developer presentation:
 * an Originkit Liquid Grid field breathing behind a stack.json terminal
 * window. The 13 AI copilots ride along as a `ls ~/ai-workbench` row.
 * (The chip-cloud column that repeated the same categories beside the
 * window was removed — the JSON file IS the stack, exactly once.)
 */
export const DevTech = memo(function DevTech() {
  return (
    <section className="sec dv-tech" id="stack" aria-label="Technologies — developer mode">
      {/* Originkit — Liquid Grid (dot physics field), lazy-mounted */}
      <div className="dv-tech-bg" aria-hidden="true">
        <LazyMount delay={200}>
          <LiquidGrid
            mode="dots"
            cellSize={24}
            radius={70}
            intensity={90}
            glowColor="#7EE787"
            lineColor="#7EE7874D"
            background="#0B0E11"
            clickRipple={true}
            collide={true}
          />
        </LazyMount>
      </div>

      <div className="wrap dv-tech-in">
        <div className="reveal">
          <SectionBadge id="stack" />
        </div>
        <p className="kicker reveal">$ pushyanth --stack</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">The stack, exactly as the resume tells it.</span>
          </span>
        </h2>
        <p
          className="bench-sub reveal"
          style={{ "--d": ".1s" } as React.CSSProperties}
        >
          Languages, frameworks, backend &amp; platform tooling: every entry
          in the file below is project-proven. The grid behind this window
          reacts to your clicks; try it.
        </p>

        <div className="dv-tech-grid">
          <DevWindow title="stack.json — read-only" prompt="cat stack.json | jq '.categories'">
            <div className="dv-code">
              <p className="dv-line">
                <span className="dv-brace">{"{"}</span>
              </p>
              <p className="dv-line dv-line-ind">
                <span className="dv-prop">&quot;categories&quot;</span>
                <span className="dv-op">:</span>{" "}
                <span className="dv-brace">{"{"}</span>
              </p>
              {TECHNOLOGIES.map((c) => (
                <p className="dv-line dv-line-ind2" key={c.id}>
                  <span className="dv-prop">&quot;{c.id}&quot;</span>
                  <span className="dv-op">:</span>{" "}
                  <span className="dv-str">&quot;{c.items.join(", ")}&quot;</span>
                  <span className="dv-op">,</span>
                </p>
              ))}
              <p className="dv-line dv-line-ind">
                <span className="dv-brace">{"}"}</span>
                <span className="dv-op">,</span>{" "}
                <span className="dv-line-comment">
                  {`// ${TECH_TOTAL} technologies, zero padding`}
                </span>
              </p>
              <p className="dv-line">
                <span className="dv-brace">{"}"}</span>
              </p>
            </div>
          </DevWindow>
        </div>

        <div
          className="dv-tech-ai reveal"
          style={{ "--d": ".2s" } as React.CSSProperties}
        >
          <p className="dv-tech-ai-label">
            <span className="dv-dim">$</span> ls ~/ai-workbench
          </p>
          <ul className="dv-tech-ai-row">
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
          {TECH_TOTAL} technologies · {TOOLS.length} ai copilots · evaluated on
          shipped outcomes
        </p>
      </div>
    </section>
  );
});
