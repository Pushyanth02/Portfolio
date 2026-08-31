import { Clock } from "./clock";
import { assetUrl } from "@/lib/utils";

const ROLES = [
  "ai-native dev",
  "systems builder",
  "cs student",
  "open-source explorer",
];

export function Hero() {
  return (
    <section className="hero" aria-label="Intro" id="hero">
      <div className="rotator" aria-hidden="true">
        <ul>
          {ROLES.map((r) => (
            <li key={r}>
              <span>{r}</span>
            </li>
          ))}
          {/* duplicate first to make the vertical loop seamless */}
          <li>
            <span>{ROLES[0]}</span>
          </li>
        </ul>
      </div>

      <div className="hero-main">
        <p className="hi">
          hi, i&apos;m <b>pushyanth</b> — i build with AI and can explain every
          line.
        </p>
        <h1 className="thesis">
          <span className="lm in">
            <span className="lm-in">
              Build with <em>AI.</em>
            </span>
          </span>
          <span
            className="lm in"
            style={{ "--d": ".12s" } as React.CSSProperties}
          >
            <span className="lm-in">Ship with certainty.</span>
          </span>
        </h1>
        <p className="hero-sub">
          CS student building for the open web. I integrate Claude, Gemini &amp;
          friends deep into my workflows — shipping AI-powered features while
          keeping every outcome deterministic, self-hosted and auditable.
        </p>
      </div>

      <aside className="hero-side">
        <div className="loc-pill">
          <span className="dot" aria-hidden="true" /> infinity • UTC +5:30 •{" "}
          <Clock /> IST
        </div>
        <img
          className="hero-doodle"
          src={assetUrl("/art/doodle.webp")}
          alt="Doodle of a friendly infinity symbol wearing a graduation cap and holding a laptop"
          width={720}
          height={720}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sizes="(max-width: 720px) 110px, (max-width: 960px) 130px, 240px"
        />
        <p className="open-pill">● open to collaboration</p>
      </aside>

      <span className="scroll-cue" aria-hidden="true">
        scroll ↓
      </span>
    </section>
  );
}
