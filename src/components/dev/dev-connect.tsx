"use client";

import { memo, useEffect, useRef } from "react";
import { usePortfolioStore } from "@/lib/store";
import { CHANNELS } from "@/components/site/connect";
import { Icon } from "@/components/site/icons";
import { SectionBadge } from "@/components/site/section-icons";
import { DevWindow } from "./dev-window";

/**
 * DevConnect — the contact channels as a runnable script.
 * Same CHANNELS data as student mode; the email row opens the
 * ContactFormDialog (name · gmail · message) which POSTs to
 * /api/contact and hands back a prefilled Gmail draft.
 */
export const DevConnect = memo(function DevConnect() {
  const openContact = usePortfolioStore((s) => s.openContact);
  const mailValRef = useRef<HTMLSpanElement>(null);

  // Light obfuscation: the address is only ever assembled client-side.
  useEffect(() => {
    const addr = ["pushyanth2008", "@", "gmail", ".", "com"].join("");
    if (mailValRef.current) mailValRef.current.textContent = addr;
  }, []);

  return (
    <section className="connect" id="connect">
      <div className="wrap">
        <div className="reveal">
          <SectionBadge id="connect" />
        </div>
        <p className="kicker reveal">$ ./contact.sh --message</p>
        <h2>
          <span className="lm">
            <span className="lm-in">
              let&apos;s <em>chat!</em>
            </span>
          </span>
        </h2>
        <p
          className="connect-intro reveal"
          style={{ "--d": ".1s" } as React.CSSProperties}
        >
          Got a project, a problem, or a beautifully weird idea? Pick a
          line, or pipe a message straight through the form — I&apos;ll answer.
        </p>

        <div className="reveal" style={{ "--d": ".12s" } as React.CSSProperties}>
          <DevWindow title="contact.sh — interactive" prompt="./contact.sh">
            <ul className="dv-conn">
              {CHANNELS.map((c) => (
                <li key={c.key} className="dv-conn-row">
                  <span className="dv-conn-label">
                    <Icon name={c.icon} fill={c.icon === "gh" || c.icon === "in"} />
                    {c.label.toLowerCase()}
                  </span>
                  {c.form ? (
                    <button
                      type="button"
                      className="dv-conn-handle dv-conn-btn"
                      onClick={openContact}
                      aria-label="Open the message form to send an email"
                      data-allow-copy
                    >
                      <span ref={mailValRef}>{c.handle}</span>
                      <span className="dv-conn-action">[ send ]</span>
                    </button>
                  ) : (
                    <a
                      className="dv-conn-handle"
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.label}: ${c.handle}`}
                    >
                      {c.handle}
                      <span className="dv-conn-action">[ open ↗ ]</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="dv-line dv-line-comment">
              {"// replies usually ship faster than features"}
            </p>
          </DevWindow>
        </div>
      </div>
    </section>
  );
});
