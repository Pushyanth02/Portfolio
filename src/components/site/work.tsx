type WorkItem = {
  name: string;
  kick: string;
  liveUrl: string;
  desc: React.ReactNode;
  learnt: string;
  tags: string[];
  img: string;
  alt: string;
  stats: { value: string; num?: number; suffix?: string; label: string }[];
};

const WORK: WorkItem[] = [
  {
    name: "Lemniscate ∞",
    kick: "flagship · self-hosted platform",
    liveUrl: "https://lemniscate2.vercel.app",
    desc: (
      <>
        A self-hosted platform that turns <strong>PDFs, DOCX &amp; TXT into structured, cinematic narratives</strong> —
        a deterministic classical-NLP core with opt-in AI enrichment layers you can toggle, audit and replay.
      </>
    ),
    learnt:
      "AI accelerates the build; determinism protects the user. The best AI features are the ones you can switch off and replay bit-for-bit.",
    tags: ["Next.js 16", "TypeScript", "Prisma + SQLite", "Socket.IO", "Docker"],
    img: "/art/lemniscate.webp",
    alt: "Illustration of an infinity-loop film reel track where manuscript pages transform into luminous cinematic scenes, directed by a cute robot with a clapperboard",
    stats: [
      { value: "225", num: 225, label: "commits" },
      { value: "100%", num: 100, suffix: "%", label: "auditable pipeline decisions" },
      { value: "1", num: 1, label: "live self-hosted deploy" },
    ],
  },
  {
    name: "InfinityFG 🌱",
    kick: "game · deterministic sim",
    liveUrl: "https://infinityfg.vercel.app",
    desc: (
      <>
        A <strong>farming-automation / story-progression game</strong> where the economy is balanced by a
        seeded, replayable simulation — AI-assisted tooling in the loop, deterministic core underneath,
        and every balance change CI-gated before merge.
      </>
    ),
    learnt:
      "seeded randomness is a superpower. When every session replays exactly, balancing stops being vibes and becomes a test suite.",
    tags: ["React 19", "TypeScript", "Vite", "Zustand", "simulate:qa:strict"],
    img: "/art/infinityfg.webp",
    alt: "Illustration of an infinity-loop automated farm with glowing hydroponic crop plots, robotic watering arms, seed packets, and floating dice beside a friendly gardener robot",
    stats: [
      { value: "100%", num: 100, suffix: "%", label: "seeded, replayable sessions" },
      { value: "CI", label: "gated economy merges" },
      { value: "live", label: "demo on vercel" },
    ],
  },
  {
    name: "Dungeoncore Necromancer 🕯️",
    kick: "reading platform · static export",
    liveUrl: "https://pushyanth02.github.io/Dungeoncore-Necromancer/",
    desc: (
      <>
        A serialized-novel reading platform — <strong>63 chapters across 7 arcs</strong>, a World Codex,
        ⌘K fuzzy search, generative Web Audio soundscapes, and four hidden easter eggs. One tuned dark
        theme; no database, no server runtime, fully static.
      </>
    ),
    learnt:
      "a site doesn't need a server to feel alive. Generative audio, persistent local state and a carefully tuned dark theme can carry an entire reading experience with zero runtime cost.",
    tags: ["Next.js 16", "TypeScript", "Tailwind 4", "shadcn/ui", "Zustand", "Web Audio"],
    img: "/art/dungeoncore.webp",
    alt: "Illustration of an open ancient book glowing by candlelight with a small friendly ghost reading it, stone dungeon arches, floating infinity symbols and musical notes",
    stats: [
      { value: "63", num: 63, label: "chapters · 7 arcs" },
      { value: "6", num: 6, label: "generative soundscapes" },
      { value: "static", label: "export · no backend" },
    ],
  },
];

import { assetUrl } from "@/lib/utils";

export function Work() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <p className="kicker reveal">the highlight reel</p>
        <h2 className="h2" style={{ marginBottom: "clamp(36px, 5vw, 64px)" }}>
          <span className="lm"><span className="lm-in">Work that actually shipped.</span></span>
        </h2>

        {WORK.map((w) => (
          <article className="work-block tilt reveal" key={w.name}>
            <div className="wb-top">
              <h3>{w.name}</h3>
              <span className="wb-kick">{w.kick}</span>
              <a className="wb-link" href={w.liveUrl} target="_blank" rel="noopener noreferrer">
                live ↗
              </a>
            </div>
            <p className="wb-desc">{w.desc}</p>
            <div className="wb-mid">
              <div className="learnt">
                <b>learnt…</b>
                {w.learnt}
              </div>
              <div>
                <ul className="tags">
                  {w.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="wb-img">
              <img
                src={assetUrl(w.img)}
                alt={w.alt}
                width={1376}
                height={768}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="impact">
              {w.stats.map((s) => (
                <div key={s.label}>
                  {s.num !== undefined ? (
                    <b data-num={s.num} data-suffix={s.suffix ?? ""}>{s.value}</b>
                  ) : (
                    <b>{s.value}</b>
                  )}
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
