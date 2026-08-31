"use client";

import { memo } from "react";
import { Icon } from "./icons";
import { usePortfolioStore } from "@/lib/store";
import type { PortfolioMode } from "@/lib/mode";

/**
 * Header — a lean chrome strip.
 *
 * Left:  the infinity logo — scrolls back to the top of the page (per
 *        the redesign: it is no longer the mode switch).
 * Right: ONLY the resume button (wayfinding lives in the icon docks;
 *        mode switching lives in each dock's trailing ∞ tile).
 *
 * The mode-chip points readers at the dock's ∞ tile for the Infinity
 * Fold. No scrollspy, no mobile dropdown — a single always-visible
 * action that fits every viewport without a menu button.
 */
export const Header = memo(function Header() {
  const mode: PortfolioMode = usePortfolioStore((s) => s.mode);
  const openResume = usePortfolioStore((s) => s.openResume);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-head">
      <div className="wrap head-in">
        {/* The infinity logo scrolls back to the top of the page — the
            standard "home" affordance. Mode switching moved to the ∞ tile
            at the end of each surface's icon dock. */}
        <button
          type="button"
          className="logo logo-top"
          onClick={scrollToTop}
          aria-label="Scroll back to the top of the page"
          title="scroll to top ↑"
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
          {mode === "student"
            ? "student ∴ tap dock ∞ for dev"
            : "developer ∴ tap dock ∞ for student"}
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
