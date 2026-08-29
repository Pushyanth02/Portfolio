"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import type { PortfolioMode } from "@/lib/mode";

type NavLink = {
  href: string;
  label: string;
  hot?: boolean;
  isResume?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "#about", label: "about" },
  { href: "#work", label: "work" },
  { href: "#stack", label: "stack" },
  { href: "#resume", label: "resume", isResume: true },
  { href: "#connect", label: "connect", hot: true },
];

interface HeaderProps {
  onOpenResume?: () => void;
  mode?: PortfolioMode;
  onToggleMode?: (e?: React.MouseEvent) => void;
}

export function Header({ onOpenResume, mode = "student", onToggleMode }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scrollspy: mark the nav link whose section is in view.
  useEffect(() => {
    const ids = NAV_LINKS.filter((l) => !l.isResume).map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Close mobile menu on outside click / Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest(".site-head")) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [open]);


  // Smooth-scroll nav: guarantees consistent section navigation across
  // browsers/states (native hash jumps can misbehave with fixed headers).
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    } else {
      history.pushState(null, "", href);
    }
  };

  const handleResumeClick = () => {
    setOpen(false);
    if (onOpenResume) {
      onOpenResume();
    } else {
      window.dispatchEvent(new CustomEvent("open-resume"));
    }
  };

  return (
    <header className="site-head">
      <div className="wrap head-in">
        {/* The infinity logo is the mode switch: student (default, warm
            notebook) ⇄ developer (dark terminal skin). The click point is
            passed through so the warp ring can burst out of the logo. */}
        <button
          type="button"
          className="logo logo-toggle"
          onClick={(e) => onToggleMode?.(e)}
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
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="siteNav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="menu" style={{ width: 20, height: 20 }} />
        </button>
        <nav className={`nav${open ? " open" : ""}`} id="siteNav" aria-label="Primary">
          {NAV_LINKS.map((l) =>
            l.isResume ? (
              <button
                key={l.label}
                type="button"
                className="nav-resume-btn"
                onClick={handleResumeClick}
                aria-label="Open Vulavala Pushyanth Reddy Resume"
              >
                {l.label} <span className="nav-resume-badge"><Icon name="inf" /></span>
              </button>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className={`${l.hot ? "hot" : ""} ${active === l.href.slice(1) ? "active" : ""}`}
                aria-current={active === l.href.slice(1) ? "page" : undefined}
                onClick={(e) => handleAnchor(e, l.href)}
              >
                {l.label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
