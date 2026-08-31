import { memo } from "react";
import { Icon } from "@/components/site/icons";
import { SectionBadge } from "@/components/site/section-icons";
import { WORK } from "@/components/site/work";
import { assetUrl } from "@/lib/utils";

/**
 * DevWork — shipped projects as repository readouts.
 * Same WORK data as student mode, presented as repo cards inside a
 * terminal session.
 */
export const DevWork = memo(function DevWork() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="work" />
        </div>
        <p className="kicker reveal">$ git log --shipped</p>
        <h2 className="h2" style={{ marginBottom: "clamp(36px, 5vw, 64px)" }}>
          <span className="lm">
            <span className="lm-in">Work that actually shipped.</span>
          </span>
        </h2>

        {WORK.map((w, i) => (
          <article className="dv-repo tilt reveal" key={w.name}>
            <div className="dv-repo-bar">
              <span className="dv-win-dots" aria-hidden="true">
                <i /> <i /> <i />
              </span>
              <span className="dv-repo-title">
                <Icon name="branch" /> {w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              </span>
              <span className="dv-repo-kick">{"// "}{w.kick}</span>
            </div>

            <div className="dv-repo-body">
              <p className="dv-repo-desc">{w.desc}</p>

              <div className="dv-repo-img">
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

              <ul className="tags" aria-label="tech stack">
                {w.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <p className="dv-learnt">
                <span className="dv-line-comment">{"// learnt → "}</span>
                {w.learnt}
              </p>

              <div className="dv-repo-foot">
                <div className="impact">
                  {w.stats.map((s) => (
                    <div key={s.label}>
                      <b data-num={s.num} data-suffix={s.suffix ?? ""}>
                        {s.value}
                      </b>
                      <span>{s.label}</span>
                    </div>
                  ))}
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
            </div>
            {i < WORK.length - 1 && (
              <p className="dv-repo-sep" aria-hidden="true">
                <span className="dv-dim">…</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
});
