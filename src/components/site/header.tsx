"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type NavLink = {
  href: string;
  label: string;
  hot?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "#stack", label: "stack" },
  { href: "#work", label: "work" },
  { href: "#about", label: "about" },
  { href: "#connect", label: "connect", hot: true },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scrollspy: mark the nav link whose section is in view.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
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
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-head">
      <div className="wrap head-in">
        <a className="logo" href="#top" aria-label="Pushyanth — back to top">
          Pushyanth <span className="inf"><Icon name="inf" /></span>
        </a>
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`${l.hot ? "hot" : ""} ${active === l.href.slice(1) ? "active" : ""}`}
              aria-current={active === l.href.slice(1) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
