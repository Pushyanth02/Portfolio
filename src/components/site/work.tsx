import { memo } from "react";
import { Icon } from "./icons";
import { SectionBadge } from "./section-icons";
import { assetUrl } from "@/lib/utils";

export type WorkItem = {
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

export const WORK: WorkItem[] = [
  {
    name: "Lemniscate ∞",
    kick: "flagship · local-first ai reading room",
    liveUrl: "https://lemniscate02.vercel.app/",
    githubUrl: "https://github.com/Pushyanth02/Lemniscate",
    desc: (
      <>
        A <strong>local-first AI reading room</strong> that turns PDFs,
        EPUBs, DOCX and stories into chapter-aware interactive spaces. No
        cloud database (IndexedDB vault), no proxy server (direct OpenRouter
        BYOK), three dedicated margin companions, and an offline extractive
        NLP engine.
      </>
    ),
    learnt:
      "keep persistence in the browser and let AI degrade gracefully to offline NLP: software becomes a permanent tool, not a subscription leash.",
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
    name: "Archmage ⚡",
    kick: "pure arcade roguelike · canvas 2d · 60fps",
    liveUrl: "https://pushyanth02.github.io/Archmage/",
    githubUrl: "https://github.com/Pushyanth02/Archmage",
    desc: (
      <>
        A <strong>pure arcade roguelike</strong> that runs entirely in the
        browser. You are the last Archmage against fifty waves across five
        biomes. Thirteen elements fuse into 78 resonances, five seed-shuffled
        tyrants each fight with a fully unique kit, and an adaptive,
        fully-synthesized score sharpens under bosses. One cover image;
        everything else is generated at runtime. No cutscenes, no filler.
      </>
    ),
    learnt:
      "constraints breed craft: a zero-allocation Canvas 2D loop, deterministic seeds and a 24-voice synth carried 60fps with zero asset files.",
    tags: [
      "Next.js 16",
      "TypeScript 5",
      "Canvas 2D",
      "Web Audio API",
      "Zustand",
      "localStorage",
    ],
    img: "/art/archmage.webp",
    alt: "Cover art of a hooded archmage wielding a flaming staff atop jagged volcanic rocks, stormy purple sky crackling with lightning",
    stats: [
      { value: "50", num: 50, label: "waves · 5 biomes" },
      { value: "78", num: 78, label: "elemental resonances" },
      { value: "5", num: 5, label: "tyrants · unique boss kits" },
    ],
  },
  {
    name: "Dungeoncore Necromancer 🕯️",
    kick: "reading platform · serialized narrative world",
    liveUrl: "https://pushyanth02.github.io/Dungeoncore-Necromancer/",
    githubUrl: "https://github.com/Pushyanth02/Dungeoncore-Necromancer",
    desc: (
      <>
        A serialized-novel reading platform and cosmic narrative world engine{" "}
        <strong>63 chapters across 7 arcs</strong>, an interactive World Codex with
        8 factions, ⌘K fuzzy search, 6 generative real-time Web Audio soundscapes,
        and hidden easter egg terminal layers. Zero database, zero server runtime, 100% static export.
      </>
    ),
    learnt:
      "a site doesn't need a server to feel alive: synthesized soundscapes, persistent local state and a calibrated dark theme carried an entire universe at zero runtime cost.",
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

export const Work = memo(function Work() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="work" />
        </div>
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
});
