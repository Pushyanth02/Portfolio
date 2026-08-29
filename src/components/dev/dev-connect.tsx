"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CHANNELS } from "@/components/site/connect";
import { Icon } from "@/components/site/icons";
import { assetUrl } from "@/lib/utils";
import { DevWindow } from "./dev-window";

/**
 * DevConnect — the contact channels as a runnable script.
 * Same CHANNELS data as student mode; email click-to-copy with toast.
 */
export function DevConnect() {
  const addrRef = useRef("");

  useEffect(() => {
    addrRef.current = ["pushyanth2008", "@", "gmail", ".", "com"].join("");
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
  };

  return (
    <section className="connect" id="connect">
      <div className="wrap">
        <p className="kicker reveal">$ ./connect.sh --no-forms</p>
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
          Got a project, a problem, or a beautifully weird idea? No forms, no
          funnels. Just pick a line and I&apos;ll answer.
        </p>

        <div className="reveal" style={{ "--d": ".12s" } as React.CSSProperties}>
          <DevWindow title="connect.sh — interactive" prompt="./connect.sh">
            <ul className="dv-conn">
              {CHANNELS.map((c) => (
                <li key={c.key} className="dv-conn-row">
                  <span className="dv-conn-label">
                    <Icon name={c.icon} fill={c.icon === "gh" || c.icon === "in"} />
                    {c.label.toLowerCase()}
                  </span>
                  {c.copy ? (
                    <button
                      type="button"
                      className="dv-conn-handle dv-conn-btn"
                      onClick={onCopy}
                      aria-label="Copy email address to clipboard"
                      data-allow-copy
                    >
                      {c.handle}
                      <span className="dv-conn-action">[ copy ]</span>
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
              <li className="dv-conn-row">
                <span className="dv-conn-label">
                  <Icon name="dl" />
                  source.zip
                </span>
                <a
                  className="dv-conn-handle"
                  href={assetUrl("/Portfolio-source.zip")}
                  download="Portfolio-source.zip"
                  aria-label="Download this portfolio's source code as a zip archive"
                >
                  Portfolio-source.zip
                  <span className="dv-conn-action">[ save ]</span>
                </a>
              </li>
            </ul>
            <p className="dv-line dv-line-comment">
              {"// replies usually ship faster than features"}
            </p>
          </DevWindow>
        </div>
      </div>
    </section>
  );
}
