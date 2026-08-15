"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Icon, type IconName } from "./icons";

/**
 * Connect — a fresh, structured card-grid contact section.
 * Three contact cards: email (click-to-copy), GitHub, LinkedIn. Each card is a
 * self-contained tile with an icon badge, label, handle and an action hint.
 * The email address is assembled client-side (light obfuscation) and never
 * appears in the server-rendered HTML.
 */
type Channel = {
  key: string;
  icon: IconName;
  label: string;
  handle: string;
  action: string;
  href?: string;
  copy?: boolean;
};

const CHANNELS: Channel[] = [
  {
    key: "email",
    icon: "mail",
    label: "Email",
    handle: "pushyanth2008@gmail.com",
    action: "click to copy",
    copy: true,
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

export function Connect() {
  const mailValRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const addrRef = useRef<string>("");

  useEffect(() => {
    const addr = ["pushyanth2008", "@", "gmail", ".", "com"].join("");
    addrRef.current = addr;
    if (mailValRef.current) mailValRef.current.textContent = addr;
  }, []);

  const onCopy = async () => {
    const addr = addrRef.current;
    if (!addr) return;
    try {
      await navigator.clipboard.writeText(addr);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = addr;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      ta.remove();
    }
    toast.success("Email copied to clipboard", { description: addr, duration: 2200 });
    const card = cardRef.current;
    if (card) {
      card.classList.add("copied");
      window.setTimeout(() => card.classList.remove("copied"), 1400);
    }
  };

  return (
    <section className="connect" id="connect">
      <div className="wrap">
        <div className="connect-head">
          <div id="connect-rover-dock" className="rover-dock" aria-label="Rover landing pad" title="Rover dock">
            <span className="dock-ghost" aria-hidden="true"><Icon name="inf" /></span>
          </div>
          <h2><span className="lm"><span className="lm-in">let&apos;s <em>chat!</em></span></span></h2>
          <p className="connect-intro reveal">
            Got a project, a problem, or a beautifully weird idea? No forms, no funnels — just pick a
            line and I&apos;ll answer.
          </p>
        </div>

        <div className="connect-grid reveal" style={{ "--d": ".12s" } as React.CSSProperties}>
          {CHANNELS.map((c) =>
            c.copy ? (
              <button
                key={c.key}
                ref={cardRef}
                type="button"
                className="ccard"
                aria-label="Copy email address to clipboard"
                onClick={onCopy}
              >
                <span className="ccard-ic"><Icon name={c.icon} /></span>
                <span className="ccard-label">{c.label}</span>
                <span className="ccard-handle"><span ref={mailValRef} className="handle-text">{c.handle}</span></span>
                <span className="ccard-action">{c.action} <span className="arr">↗</span></span>
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
                <span className="ccard-ic"><Icon name={c.icon} fill /></span>
                <span className="ccard-label">{c.label}</span>
                <span className="ccard-handle"><span className="handle-text">{c.handle}</span></span>
                <span className="ccard-action">{c.action} <span className="arr">↗</span></span>
              </a>
            )
          )}
        </div>

        <p className="cta-note reveal" style={{ "--d": ".25s" } as React.CSSProperties}>
          Replies usually ship faster than features.
        </p>
      </div>
    </section>
  );
}
