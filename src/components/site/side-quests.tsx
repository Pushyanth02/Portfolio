import { memo } from "react";
import { Icon, type IconName } from "./icons";
import { SectionBadge } from "./section-icons";

export type Quest = {
  icon: IconName;
  title: string;
  role: string;
  body: string;
  href?: string;
  tags?: string[];
  badges?: { title: string; icon: IconName; label: string }[];
  delay?: string;
};

export const QUESTS: Quest[] = [
  {
    icon: "id",
    title: "GitHub Profile README",
    role: "role: writer + dev · self-referential",
    body: "A styled, animated profile: capsule-render banners, a skill-icon stack, a live streak and one mantra. The profile is the project.",
    href: "https://github.com/Pushyanth02/Pushyanth02",
    tags: ["SVG animation", "markdown craft"],
  },
  {
    icon: "graph",
    title: "DSA, daily",
    role: "role: student · the honest grind",
    body: "Data structures and algorithms in C++: one problem at a time, patterns over memorisation, proofs over vibes.",
    href: "https://github.com/Pushyanth02",
    tags: ["C++", "patterns", "consistency"],
    delay: ".1s",
  },
  {
    icon: "award",
    title: "Achievement hunting",
    role: "github badges · dev-culture flavour",
    body: "Collected along the way: not accolades, just proof the keyboard gets used.",
    href: "https://github.com/Pushyanth02?tab=achievements",
    badges: [
      { title: "merged pull requests", icon: "award", label: "pull shark" },
      { title: "co-authored commits", icon: "graph", label: "pair extraordinaire" },
      { title: "merged without review", icon: "bolt", label: "yolo" },
    ],
    delay: ".2s",
  },
  {
    icon: "branch",
    title: "Open source, ongoing",
    role: "role: explorer + contributor",
    body: "Digging through interesting repos, filing thoughtful issues and learning how big codebases breathe. Contributions in motion.",
    href: "https://github.com/Pushyanth02?tab=repositories",
    tags: ["community", "PRs", "learning in public"],
    delay: ".3s",
  },
];

export const SideQuests = memo(function SideQuests() {
  return (
    <section className="sec quests" id="quests">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="quests" />
        </div>
        <p className="kicker reveal">off the main path</p>
        <h2 className="h2"><span className="lm"><span className="lm-in">Side quests.</span></span></h2>
        <div className="quest-grid">
          {QUESTS.map((q) => (
            <article
              className="quest tilt reveal"
              key={q.title}
              style={q.delay ? ({ "--d": q.delay } as React.CSSProperties) : undefined}
            >
              <span className="q-emoji"><Icon name={q.icon} /></span>
              <h4>
                {q.href ? (
                  <a
                    href={q.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                    className="quest-title-link"
                  >
                    {q.title} <span style={{ opacity: 0.5, fontSize: "0.85em" }}>↗</span>
                  </a>
                ) : (
                  q.title
                )}
              </h4>
              <span className="q-role">{q.role}</span>
              <p>{q.body}</p>
              {q.badges ? (
                <div className="badges">
                  {q.badges.map((b) => (
                    <span key={b.label} title={b.title}>
                      <Icon name={b.icon} />{b.label}
                    </span>
                  ))}
                </div>
              ) : q.tags ? (
                <ul className="tags">
                  {q.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
