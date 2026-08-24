import { Icon } from "./icons";
import { assetUrl } from "@/lib/utils";

type WorkItem = {
  name: string;
  kick: string;
  liveUrl?: string;
  githubUrl?: string;
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
    kick: "flagship · local-first ai reading room",
    liveUrl: "https://lemniscate2.vercel.app",
    githubUrl: "https://github.com/Pushyanth02/Lemniscate",
    desc: (
      <>
        A sovereign, <strong>local-first AI reading room</strong> that turns
        PDFs, EPUBs, DOCX, and stories into chapter-aware interactive spaces.
        Zero cloud databases (IndexedDB vault), zero proxy servers (direct
        OpenRouter BYOK), 3 dedicated margin companions, and an offline Anchor
        extractive NLP engine.
      </>
    ),
    learnt:
      "local-first architecture protects user sovereignty. When persistence stays in browser memory and AI degrades gracefully to extractive NLP offline, software becomes a permanent tool rather than a subscription leash.",
    tags: [
      "Next.js 16",
      "TypeScript Strict",
      "Tailwind 4",
      "IndexedDB",
      "OpenRouter BYOK",
      "pdf.js + JSZip",
    ],
    img: "/art/lemniscate.webp",
    alt: "Illustration of an infinity-loop film reel track where manuscript pages transform into luminous cinematic scenes, directed by a cute robot with a clapperboard",
    stats: [
      {
        value: "100%",
        num: 100,
        suffix: "%",
        label: "local-first · zero telemetry",
      },
      { value: "3", num: 3, label: "dedicated ai companions" },
      { value: "0", num: 0, label: "server proxy · sovereign client" },
    ],
  },
  {
    name: "Luck-O-Matic 9000 🎰",
    kick: "luck tycoon · narrative idle incremental",
    liveUrl: "https://Pushyanth02.github.io/LuckOMatic-9000/",
    githubUrl: "https://github.com/Pushyanth02/LuckOMatic-9000",
    desc: (
      <>
        An atmospheric, <strong>narrative-driven luck tycoon &amp; idle-incremental game</strong>.
        Inherit Grandpa Otto&apos;s mysterious 1962 charm-printing machine, pull the brass lever
        with procedural reel physics, automate the shop floor, unearth buried relics beneath floorboards,
        and decipher a 5-act story etched into vintage cassette tapes.
      </>
    ),
    learnt:
      "a great idle game is worldbuilding in disguise. Procedural Web Audio synthesis, seeded reel physics, and responsive tactile animations turn simple RNG numbers into an emotional narrative arc.",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript 5",
      "Tailwind 4",
      "Web Audio API",
      "Zustand",
    ],
    img: "/art/luckomatic.webp",
    alt: "Illustration of Grandpa Otto's vintage 1962 Luck-O-Matic charm-printing machine with three glowing reels and a brass lever, printing lucky charms in a cozy warm workshop with a cute robot helper, cassette tapes, and glowing relics",
    stats: [
      {
        value: "30",
        num: 30,
        label: "collectible charms · 6 tiers",
      },
      { value: "15", num: 15, label: "buried relics · 5 strata" },
      { value: "5-Act", label: "story · full client audio synth" },
    ],
  },
  {
    name: "Dungeoncore Necromancer 🕯️",
    kick: "reading platform · serialized narrative world",
    liveUrl: "https://pushyanth02.github.io/Dungeoncore-Necromancer/",
    githubUrl: "https://github.com/Pushyanth02/Dungeoncore-Necromancer",
    desc: (
      <>
        A serialized-novel reading platform and cosmic narrative world engine —{" "}
        <strong>63 chapters across 7 arcs</strong>, an interactive World Codex with
        8 factions, ⌘K fuzzy search, 6 generative real-time Web Audio soundscapes,
        and hidden easter egg terminal layers. Zero database, zero server runtime, 100% static export.
      </>
    ),
    learnt:
      "a site doesn't need a server to feel alive. Real-time synthesized audio harmonic chords, persistent local state, and a meticulously calibrated void dark theme can carry an entire universe with zero runtime cost.",
    tags: [
      "Next.js 16",
      "TypeScript 5",
      "Tailwind 4",
      "shadcn/ui",
      "Zustand",
      "Web Audio",
    ],
    img: "/art/dungeoncore.webp",
    alt: "Illustration of an open ancient book glowing by candlelight with a small friendly ghost reading it, stone dungeon arches, floating infinity symbols and musical notes",
    stats: [
      { value: "63", num: 63, label: "chapters · 7 arcs" },
      { value: "6", num: 6, label: "generative soundscapes" },
      {
        value: "100%",
        num: 100,
        suffix: "%",
        label: "static export · zero server cost",
      },
    ],
  },
];

export function Work() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <p className="kicker reveal">the highlight reel</p>
        <h2 className="h2" style={{ marginBottom: "clamp(36px, 5vw, 64px)" }}>
          <span className="lm">
            <span className="lm-in">Work that actually shipped.</span>
          </span>
        </h2>

        {WORK.map((w) => (
          <article className="work-block tilt reveal" key={w.name}>
            <div className="wb-top">
              <div>
                <h3>{w.name}</h3>
                <span className="wb-kick">{w.kick}</span>
              </div>
              <div className="wb-actions">
                {w.githubUrl && (
                  <a
                    className="wb-link wb-code"
                    href={w.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${w.name} GitHub repository`}
                  >
                    <Icon name="gh" /> code ↗
                  </a>
                )}
                {w.liveUrl && (
                  <a
                    className="wb-link wb-live"
                    href={w.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${w.name} live deployment`}
                  >
                    live ↗
                  </a>
                )}
              </div>
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
                width={1280}
                height={714}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 960px) 100vw, 75vw"
              />
            </div>
            <div className="impact">
              {w.stats.map((s) => (
                <div key={s.label}>
                  {s.num !== undefined ? (
                    <b data-num={s.num} data-suffix={s.suffix ?? ""}>
                      {s.value}
                    </b>
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
