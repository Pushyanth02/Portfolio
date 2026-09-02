"use client";

import { memo, useEffect, useRef } from "react";
import { usePortfolioStore } from "@/lib/store";
import { Icon, type IconName } from "./icons";
import { SectionBadge } from "./section-icons";

/**
 * Connect — a fresh, structured card-grid contact section.
 * Three contact cards: email (opens the message form), GitHub, LinkedIn.
 * Each card is a self-contained tile with an icon badge, label, handle
 * and an action hint. The email address is assembled client-side (light
 * obfuscation) and never appears in the server-rendered HTML.
 *
 * The email card is now a gateway to the ContactFormDialog (name · gmail
 * · message) instead of click-to-copy — the note goes through the
 * /api/contact pipeline (validated, rate-limited, stored) and arrives as
 * a prefilled Gmail draft in the owner's inbox.
 */
export type Channel = {
  key: string;
  icon: IconName;
  label: string;
  handle: string;
  action: string;
  href?: string;
  /** Opens the contact form dialog instead of navigating. */
  form?: boolean;
};

export const CHANNELS: Channel[] = [
  {
    key: "email",
    icon: "mail",
    label: "Email",
    handle: "pushyanth2008@gmail.com",
    action: "send a message",
    form: true,
  },
  {
    key: "github",
    icon: "gh",
    label: "GitHub",
    handle: "Pushyanth02",
    action: "open profile",
    href: "https://github.com/Pushyanth02",
  },
  {
    key: "linkedin",
    icon: "in",
    label: "LinkedIn",
    handle: "pushyanth-reddy",
    action: "open profile",
    href: "https://www.linkedin.com/in/pushyanth-reddy",
  },
];

export const Connect = memo(function Connect() {
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
        <div className="connect-head">
          <div
            id="connect-rover-dock"
            className="rover-dock"
            aria-label="Rover landing pad"
            title="Rover dock"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
              }
            }}
          >
            <span className="dock-ghost" aria-hidden="true">
              <Icon name="inf" />
            </span>
          </div>
          <div className="reveal">
            <SectionBadge id="connect" />
          </div>
          <h2>
            <span className="lm">
              <span className="lm-in">
                let&apos;s <em>chat!</em>
              </span>
            </span>
          </h2>
          <p className="connect-intro reveal">
            Got a project, a problem, or a beautifully weird idea? Pick a
            line, or send a note straight through the form — I&apos;ll answer.
          </p>
        </div>

        <div
          className="connect-grid reveal"
          style={{ "--d": ".12s" } as React.CSSProperties}
        >
          {CHANNELS.map((c) =>
            c.form ? (
              <button
                key={c.key}
                type="button"
                className="ccard"
                aria-label="Open the message form to send an email"
                onClick={openContact}
              >
                <span className="ccard-ic">
                  <Icon name={c.icon} />
                </span>
                <span className="ccard-label">{c.label}</span>
                <span className="ccard-handle">
                  <span ref={mailValRef} className="handle-text">
                    {c.handle}
                  </span>
                </span>
                <span className="ccard-action">
                  {c.action} <span className="arr">↗</span>
                </span>
              </button>
            ) : (
              <a
                key={c.key}
                className="ccard"
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.label}: ${c.handle}`}
              >
                <span className="ccard-ic">
                  <Icon name={c.icon} fill />
                </span>
                <span className="ccard-label">{c.label}</span>
                <span className="ccard-handle">
                  <span className="handle-text">{c.handle}</span>
                </span>
                <span className="ccard-action">
                  {c.action} <span className="arr">↗</span>
                </span>
              </a>
            ),
          )}
        </div>

        <p
          className="cta-note reveal"
          style={{ "--d": ".25s" } as React.CSSProperties}
        >
          Replies usually ship faster than features.
        </p>
      </div>
    </section>
  );
});
