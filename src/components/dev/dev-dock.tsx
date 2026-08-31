"use client";

import { useEffect, useMemo, useState } from "react";
import Dock, { type DockItemDef } from "@/components/lightswind/dock";
import { useVisualLift } from "@/components/lightswind/use-visual-lift";
import { Icon } from "@/components/site/icons";
import { sectionGlyphFor, type SectionKey } from "@/components/site/section-icons";
import { toggleModeFromEvent } from "@/lib/store";

/**
 * DevDock — the developer-mode surface's Docker-style navigation.
 *
 * A Lightswind Dock (macOS magnification) skinned as a container
 * terminal: mono labels, terminal-green active state, a running-dot
 * indicator per section. It shares its icon set and scrollspy band
 * with the student surface's StudentDock (same glyphs via
 * `sectionGlyphFor`, same observer band) so the two docks are exact
 * behavioural mirrors — only the skin differs.
 *
 * Scrollspy mirrors the section band. The final item is the mode toggle:
 * its click point becomes the Infinity Fold's origin. (The source.zip
 * download item was removed from the dock by design — the surface now
 * carries navigation and the fold only.)
 */

const SECTIONS: { id: string; label: string; sec: SectionKey }[] = [
  { id: "about", label: "about", sec: "about" },
  { id: "work", label: "work", sec: "work" },
  { id: "stack", label: "stack", sec: "stack" },
  { id: "beliefs", label: "laws", sec: "laws" },
  { id: "certs", label: "certs", sec: "certs" },
  { id: "connect", label: "connect", sec: "connect" },
];

export function DevDock() {
  const [active, setActive] = useState("");
  // Touch-safe placement: on browsers whose layout viewport extends below
  // the screen (collapsing URL bars), the fixed frame would sit behind the
  // browser chrome — this lift keeps it inside the actually-visible area
  // so every tile stays tappable on every device. (No-op on desktop.)
  const lift = useVisualLift();

  // Scrollspy: same observer band as the sections, so dock + badges agree.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const items: DockItemDef[] = useMemo(
    () => [
      ...SECTIONS.map((s) => {
        const Glyph = sectionGlyphFor(s.sec);
        return {
          id: s.id,
          label: `cd ~/${s.label}`,
          icon: <Glyph strokeWidth={1.8} width={20} height={20} />,
          onClick: () => {
            const el = document.getElementById(s.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              history.pushState(null, "", `#${s.id}`);
            }
          },
          active: active === s.id,
        };
      }),
      {
        id: "mode-toggle",
        label: "fold → student.env",
        icon: <Icon name="inf" />,
        onClick: (e: React.MouseEvent) => toggleModeFromEvent(e),
      },
    ],
    [active]
  );

  return (
    <div
      className="dv-dock"
      data-active={active || undefined}
      style={{ "--vv-lift": `${lift}px` } as React.CSSProperties}
    >
      <Dock
        items={items}
        className="dv-dock-panel"
        baseItemSize={44}
        magnification={64}
        distance={120}
      />
    </div>
  );
}
