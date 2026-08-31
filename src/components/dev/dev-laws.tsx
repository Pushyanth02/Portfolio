import { memo } from "react";
import DotMatrix from "@/components/originkit/dotmatrix";
import { BELIEFS } from "@/components/site/beliefs";
import { SectionBadge } from "@/components/site/section-icons";
import { LazyMount } from "@/components/site/lazy-mount";

/**
 * DevLaws — the 3 engineering laws, rendered as the dark band the
 * student surface used to wear. The design shifted wholesale into the
 * developer universe: same Dot Matrix field, same compact etiquette-line
 * cards, now breathing in terminal greens under the ∞. The two band
 * instances share their structural CSS through the --law-* variables;
 * this one carries the dark palette.
 */
export const DevLaws = memo(function DevLaws() {
  return (
    <section className="dv-laws" id="beliefs" aria-label="Engineering laws">
      {/* Originkit — Dot Matrix (WebGL dot field), lazy-mounted.
          Deep greens on near-black: the field reads as phosphor texture
          behind the terminal type. */}
      <div className="laws-bg" aria-hidden="true">
        <LazyMount delay={200}>
          <DotMatrix
            colors={["#1A2E24", "#22503A", "#0A0D11"]}
            bgColor="#0B0E11"
            cellSize={22}
            gamma={4}
            speed={5}
            frequency={1}
            paletteBias={10}
          />
        </LazyMount>
      </div>

      <div className="wrap laws-in">
        <header className="laws-head reveal">
          <div>
            <SectionBadge id="laws" />
          </div>
          <p className="kicker">$ cat core.config.ts</p>
          <h2 className="h2">
            <span className="lm">
              <span className="lm-in">3 laws compiled into every build.</span>
            </span>
          </h2>
        </header>

        <ol className="laws-row">
          {BELIEFS.map((b, i) => (
            <li
              className="law reveal"
              key={b.no}
              style={{ "--d": `${0.08 + i * 0.09}s` } as React.CSSProperties}
              tabIndex={0}
            >
              <span className="law-rule" aria-hidden="true" />
              <div className="law-head">
                <span className="law-no">{b.no}</span>
                <span className="law-tag">{b.tag}</span>
              </div>
              <h3 className="law-title">{b.title}</h3>
              <p className="law-body">{b.body}</p>
              <span className="law-more" aria-hidden="true">
                hold to expand ─╮
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
});
