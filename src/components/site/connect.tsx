"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import SvgParticles from "@/components/originkit/svg-particles";
import { LazyMount } from "./lazy-mount";
import { Icon, type IconName } from "./icons";

/**
 * Connect — a fresh, structured card-grid contact section.
 * Three contact cards: email (click-to-copy), GitHub, LinkedIn. Each card is a
 * self-contained tile with an icon badge, label, handle and an action hint.
 * The email address is assembled client-side (light obfuscation) and never
 * appears in the server-rendered HTML.
 *
 * The finale breathes: an Originkit SVG Particles field — relocated here
 * from the retired thesis band — drifts behind the cards in deep warm
 * tones. The copy layer is pointer-transparent (cards re-enabled
 * individually), so the ∞ assembles wherever the pointer roams the open
 * ground and scatters over the cards.
 */
export type Channel = {
  key: string;
  icon: IconName;
  label: string;
  handle: string;
  action: string;
  href?: string;
  copy?: boolean;
};

export const CHANNELS: Channel[] = [
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
    toast.success("Email copied to clipboard", {
      description: addr,
      duration: 2200,
    });
    const card = cardRef.current;
    if (card) {
      card.classList.add("copied");
      window.setTimeout(() => card.classList.remove("copied"), 1400);
    }
  };

  return (
    <section className="connect has-field" id="connect">
      {/* Originkit — SVG Particles (∞ particle field), lazy-mounted so the
          finale never competes with first paint. Deep warm palette reads as
          drifting confetti over the sun band. */}
      <div className="connect-field" aria-hidden="true">
        <LazyMount delay={180}>
          <SvgParticles
            colors={["#201A14", "#8A3B1E", "#3E7C4F", "#6B5A44"]}
            count={700}
            size={4}
            roam={true}
            repel={true}
            repelRadius={80}
            repelForce={7}
            duration={850}
            ariaLabel="Infinity symbol formed by drifting particles"
          />
        </LazyMount>
      </div>
      <div className="wrap">
        <div className="connect-head">
          <div
            id="connect-rover-dock"
            className="rover-dock"
            aria-label="Rover landing pad"
            title="Rover dock"
            role="button"
            tabIndex={0}
          >
            <span className="dock-ghost" aria-hidden="true">
              <Icon name="inf" />
            </span>
          </div>
          <h2>
            <span className="lm">
              <span className="lm-in">
                let&apos;s <em>chat!</em>
              </span>
            </span>
          </h2>
          <p className="connect-intro reveal">
            Got a project, a problem, or a beautifully weird idea? No forms, no
            funnels. Just pick a line and I&apos;ll answer.
          </p>
        </div>

        <div
          className="connect-grid reveal"
          style={{ "--d": ".12s" } as React.CSSProperties}
        >
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
}
