"use client";

import { memo } from "react";
import { Icon } from "./icons";
import { usePortfolioStore, toggleModeFromEvent } from "@/lib/store";
import type { PortfolioMode } from "@/lib/mode";

/**
 * Header — a lean chrome strip.
 *
 * Left:  the infinity logo (the mode switch — student ⇄ dev, click point
 *        feeds the Infinity Fold's origin).
 * Right: ONLY the resume button (per the redesign: the section nav links
 *        were removed; wayfinding lives in the Rover (student) and the
 *        DevDock (dev), which both scrollspy on their own).
 *
 * No scrollspy, no mobile dropdown — a single always-visible action that
 * fits every viewport without a menu button.
 */
export const Header = memo(function Header() {
  const mode: PortfolioMode = usePortfolioStore((s) => s.mode);
  const openResume = usePortfolioStore((s) => s.openResume);

  return (
    <header className="site-head">
      <div className="wrap head-in">
        {/* The infinity logo is the mode switch: student (default, warm
            notebook) ⇄ developer (dark terminal skin). The click point is
            passed through so the warp ring can burst out of the logo. */}
        <button
          type="button"
          className="logo logo-toggle"
          onClick={(e) => toggleModeFromEvent(e)}
          aria-label={
            mode === "student"
              ? "Switch to developer mode: same portfolio, dark terminal skin"
              : "Switch back to student mode: warm sticker notebook"
          }
          title={
            mode === "student"
              ? "enter developer mode ∞"
              : "back to student mode ∞"
          }
        >
          <span className="logo-student">
            Pushyanth <span className="inf"><Icon name="inf" /></span>
          </span>
          <span className="logo-dev" aria-hidden="true">
            pushyanth@<span className="inf"><Icon name="inf" /></span>:~
            <span className="logo-cursor" aria-hidden="true">▊</span>
          </span>
        </button>
        <span className="mode-chip" aria-hidden="true">
          {mode === "student" ? "student ∴ click ∞ for dev" : "developer ∴ click ∞ for student"}
        </span>
        <nav className="nav" id="siteNav" aria-label="Resume">
          <button
            type="button"
            className="nav-resume-btn"
            onClick={openResume}
            aria-label="Open Vulavala Pushyanth Reddy Resume"
          >
            resume <span className="nav-resume-badge"><Icon name="inf" /></span>
          </button>
        </nav>
      </div>
    </header>
  );
});
