type Belief = {
  no: string;
  tag: string;
  title: string;
  body: React.ReactNode;
  img: string;
  alt: string;
};

const BELIEFS: Belief[] = [
  {
    no: "01",
    tag: "AUDITABLE BY DESIGN",
    title: "Deterministic core. AI at the steering wheel.",
    body: (
      <>
        I hammer frontier models daily — Claude, Gemini, GPT, local weights. But intelligence
        without inspectability is just gambling. Every AI pipeline I architect must be{" "}
        <strong>deterministic at its core:</strong> bit-for-bit replayable, auditable down to
        the token, and toggleable on command. Never outsource taste, logic, or truth to a black box.
      </>
    ),
    img: "/art/belief-ai.webp",
    alt: "Illustration of a transparent robot head with visible golden gears and neural core, inspected by a magnifying glass with a green checkmark stamp",
  },
  {
    no: "02",
    tag: "ZERO HOSTAGES · LOCAL FIRST",
    title: "Your data stays on your metal.",
    body: (
      <>
        If software dies when the WiFi drops, or phones home every keystroke to an ad broker,
        it&apos;s not a tool — it&apos;s a leash. I build <strong>self-hosted, offline-first architectures</strong> powered
        by SQLite, Prisma, and ironclad boundaries. Zero telemetry, zero cloud hostages, and a locked front door.
      </>
    ),
    img: "/art/belief-data.webp",
    alt: "Illustration of a cozy brick cottage with an open doorway revealing a glowing home server rack, roof garden, and a golden heart padlock",
  },
  {
    no: "03",
    tag: "OPEN SOURCE MAXIMALISM",
    title: "Compound in public. Fork without permission.",
    body: (
      <>
        Good code dies in private repos; great systems <strong>compound under the sunlight</strong> of
        the open web. I chase bleeding-edge tech hands-first, break things in public, ship raw, and build
        tools the community can inspect, fork, and push forward. Zero gatekeeping, zero fluff.
      </>
    ),
    img: "/art/belief-open.webp",
    alt: "Illustration of friendly robotic and human hands assembling a glowing infinity-shaped jigsaw puzzle with sprouting plants and code brackets",
  },
];

import { assetUrl } from "@/lib/utils";

export function Beliefs() {
  return (
    <section className="sec" id="beliefs">
      <div className="wrap">
        <p className="kicker reveal">my operating system</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">3 engineering laws I refuse to compromise on.</span>
          </span>
        </h2>

        {BELIEFS.map((b) => (
          <div className="belief" key={b.no}>
            <div className="reveal">
              <div className="belief-head">
                <span className="belief-no">{b.no}</span>
                <span className="belief-tag">{b.tag}</span>
              </div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
            <div className="belief-img reveal" style={{ "--d": ".15s" } as React.CSSProperties}>
              <div className="kb">
                <img
                  src={assetUrl(b.img)}
                  alt={b.alt}
                  width={1200}
                  height={896}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
