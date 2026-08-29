import DotMatrix from "@/components/originkit/dotmatrix";
import { LazyMount } from "./lazy-mount";

export type Belief = {
  no: string;
  tag: string;
  title: string;
  body: React.ReactNode;
  /** one-line terminal-voice summary — the dev-mode rendering of the law */
  note: string;
  img: string;
  alt: string;
};

export const BELIEFS: Belief[] = [
  {
    no: "01",
    tag: "AUDITABLE BY DESIGN",
    title: "Deterministic core. AI at the steering wheel.",
    body: (
      <>
        Claude, Gemini, GPT, local weights: I use them daily. But
        intelligence you can&apos;t inspect is just gambling. Every AI pipeline
        I build stays <strong>deterministic at its core:</strong> replayable
        bit-for-bit, auditable down to the token, and switchable off on
        command. Taste, logic and truth never get outsourced to a black box.
      </>
    ),
    note: "ai pipelines stay deterministic at the core: replayable, auditable, toggleable.",
    img: "/art/belief-ai.webp",
    alt: "Illustration of a transparent robot head with visible golden gears and neural core, inspected by a magnifying glass with a green checkmark stamp",
  },
  {
    no: "02",
    tag: "ZERO HOSTAGES · LOCAL FIRST",
    title: "Your data stays on your metal.",
    body: (
      <>
        If software dies when the WiFi drops, or phones home with every
        keystroke, it isn&apos;t a tool. It&apos;s a leash. I build{" "}
        <strong>self-hosted, offline-first architectures</strong> on SQLite,
        Prisma and hard boundaries: zero telemetry, zero cloud hostages, one
        locked front door.
      </>
    ),
    note: "self-hosted, offline-first, zero telemetry. your data stays on your metal.",
    img: "/art/belief-data.webp",
    alt: "Illustration of a cozy brick cottage with an open doorway revealing a glowing home server rack, roof garden, and a golden heart padlock",
  },
  {
    no: "03",
    tag: "OPEN SOURCE MAXIMALISM",
    title: "Compound in public. Fork without permission.",
    body: (
      <>
        Good code dies in private repos. Great systems{" "}
        <strong>compound in the open</strong>. I chase new tech hands-first,
        break things in public, and build tools anyone can inspect, fork and
        push forward. Zero gatekeeping, zero fluff.
      </>
    ),
    note: "build in the open. inspect, fork, push forward. zero gatekeeping.",
    img: "/art/belief-open.webp",
    alt: "Illustration of friendly robotic and human hands assembling a glowing infinity-shaped jigsaw puzzle with sprouting plants and code brackets",
  },
];

/**
 * Beliefs — the laws, compressed. A tight band of etiquette lines: an
 * Originkit Dot Matrix field breathing in warm paper tones behind three
 * compact law cards (hairline dividers, small-caps tags, drawn-in top
 * rules). Bodies stay clamped until hover / focus so the band never eats
 * the page. The same band structure renders in developer mode as the
 * dark .dv-laws — the two share their CSS via the --law-* variables.
 */
export function Beliefs() {
  return (
    <section className="laws-band" id="beliefs" aria-label="Engineering laws">
      {/* Originkit — Dot Matrix (WebGL dot field), lazy-mounted.
          Palette kept soft and warm (parchment / sand / clay) so the field
          reads as paper texture behind the ink type — the notebook theme,
          carried through. */}
      <div className="laws-bg" aria-hidden="true">
        <LazyMount delay={200}>
          <DotMatrix
            colors={["#E9D9BC", "#F2C7A6", "#E3DCC8"]}
            bgColor="#F2E9D8"
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
          <p className="kicker">my operating system</p>
          <h2 className="h2">
            <span className="lm">
              <span className="lm-in">3 laws. Zero exceptions.</span>
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
}
