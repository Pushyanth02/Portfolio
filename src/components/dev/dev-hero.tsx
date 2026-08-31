"use client";

import { Clock } from "@/components/site/clock";
import TextMorph from "@/components/originkit/text-morph";
import LiquidGlassCluster from "@/components/originkit/glass-icon";
import DataPixelArc from "@/components/originkit/data-pixel-arc";
import { LazyMount } from "@/components/site/lazy-mount";

/**
 * DevHero — developer-mode intro. A full-bleed Originkit Data Pixel Arc
 * (terminal-green pixel mosaic, hover-reactive) breathes behind the prompt;
 * the Originkit TextMorph cycles the engineering values and the Originkit
 * Liquid Glass torus stays on the right stage. Drag orbits the glass body;
 * pointer movement tilts it.
 */
export function DevHero() {
  return (
    <section className="sec dv-hero" aria-label="Intro — developer mode" id="hero">
      {/* Originkit — Data Pixel Arc (hover-reactive pixel mosaic),
          lazy-mounted so the warp reveal never stalls on canvas init */}
      <div className="dv-hero-bg" aria-hidden="true">
        <LazyMount>
          <DataPixelArc
            background="#0B0E11"
            baseColor="#22FF00"
            accentColor="#00FF7D"
            highlight="#EAFFF0"
            density={84}
            dotSize={64}
            speed={80}
            hover={46}
          />
        </LazyMount>
      </div>

      <div className="wrap dv-hero-grid">
        <div className="dv-hero-copy">
          <p className="dv-term" aria-hidden="true">
            <span className="dv-user">pushyanth</span>
            <span className="dv-at">@</span>
            <span className="dv-host">infinity</span>
            <span className="dv-dim">:~$</span>{" "}
            ./portfolio&nbsp;--mode=<span className="dv-str">developer</span>
          </p>

          <p className="dv-hi">
            i ship AI-assisted builds. every line audited, every outcome
            reproducible.
          </p>

          <p className="dv-thesis">
            Build with <em>AI.</em> Ship with certainty.
          </p>

          {/* Originkit — Text Morph (gooey word cycler) */}
          <div
            className="dv-morph reveal"
            aria-label="Engineering values: deterministic, local-first, auditable, open-source"
          >
            <TextMorph
              words={"DETERMINISTIC\nLOCAL-FIRST\nAUDITABLE\nOPEN-SOURCE"}
              color="var(--dv-coral)"
              font={{
                fontFamily: "var(--mono)",
                fontSize: "clamp(30px, 5.2vw, 58px)",
                fontWeight: 700,
                lineHeight: "1.1em",
                letterSpacing: "0.03em",
                textAlign: "center",
              }}
              transition={{ type: "tween", duration: 0.9, delay: 1.25, ease: "easeInOut" }}
            />
          </div>

          <p
            className="dv-hero-sub reveal"
            style={{ "--d": ".1s" } as React.CSSProperties}
          >
            CS student building for the open web. Claude, Gemini and friends
            are wired straight into my workflow: they speed things up, they
            never get the final word. Everything ships deterministic,
            self-hosted and auditable.
          </p>

          <div
            className="dv-status reveal"
            style={{ "--d": ".2s" } as React.CSSProperties}
          >
            <span className="dv-pill">
              <span className="dv-dot" aria-hidden="true" /> online
            </span>
            <span className="dv-pill">
              bangalore · <Clock /> IST
            </span>
            <span className="dv-pill dv-pill-hot">MODE: DEVELOPER</span>
          </div>
        </div>

        {/* Originkit — Glass Icon (liquid glass cluster), lazy-mounted so
            the warp reveal never stalls on WebGL init */}
        <div
          className="dv-glass-stage reveal"
          style={{ "--d": ".15s" } as React.CSSProperties}
        >
          <LazyMount delay={260} className="dv-glass-mount">
            <LiquidGlassCluster
              style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
              background="#0b0e11"
              shape="Torus"
              size={56}
              speed={55}
              direction="Clockwise"
              backdrop={{
                type: "Text",
                text: "∞ ∞ ∞",
                textColor: "#e8603c",
                font: {
                  fontFamily: "Space Mono, ui-monospace, monospace",
                  fontSize: 130,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: 0,
                },
              }}
              glass={{ tint: "#FFFFFF", chromatic: 79, frost: 50 }}
            />
          </LazyMount>
          <p className="dv-glass-cap" aria-hidden="true">
            {"// liquid glass · drag to orbit · hover to tilt"}
          </p>
        </div>
      </div>
    </section>
  );
}
