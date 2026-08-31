import { memo } from "react";
import { QUESTS } from "@/components/site/side-quests";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";

/**
 * DevQuests — side quests rendered as a git log. Same QUESTS data as
 * student mode.
 */
const HASHES = ["f4c8e21", "a17b3d9", "0dd5e88", "9c2a417"];

export const DevQuests = memo(function DevQuests() {
  return (
    <section className="sec quests" id="quests">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="quests" />
        </div>
        <p className="kicker reveal">$ git log --oneline --all</p>
        <h2 className="h2">
          <span className="lm">
            <span className="lm-in">Side quests.</span>
          </span>
        </h2>

        <DevWindow title="git — side-quests" prompt="git log --oneline --all">
          <div className="dv-log">
            {QUESTS.map((q, i) => (
              <div className="dv-commit reveal" key={q.title}>
                <p className="dv-commit-head">
                  <span className="dv-hash">{HASHES[i % HASHES.length]}</span>
                  {i === 0 && (
                    <span className="dv-ref" aria-hidden="true">
                      (HEAD → main)
                    </span>
                  )}
                  <span className="dv-msg">
                    <span className="dv-type">
                      {q.href ? "feat" : "docs"}:
                    </span>{" "}
                    {q.title.toLowerCase()}
                  </span>
                </p>
                {q.href ? (
                  <a
                    className="dv-commit-body dv-commit-link"
                    href={q.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {q.body} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <p className="dv-commit-body">{q.body}</p>
                )}
                <p className="dv-commit-meta">
                  <span className="dv-scope">{q.role}</span>
                  {q.tags?.map((t) => (
                    <span className="dv-tag-chip" key={t}>
                      #{t.replace(/\s+/g, "-").toLowerCase()}
                    </span>
                  ))}
                  {q.badges?.map((b) => (
                    <span className="dv-tag-chip" key={b.label} title={b.title}>
                      ★ {b.label}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </DevWindow>
      </div>
    </section>
  );
});
