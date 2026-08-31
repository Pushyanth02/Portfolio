"use client";

import { useEffect, useMemo, useState } from "react";
import Dock, { type DockItemDef } from "@/components/lightswind/dock";
import { Icon } from "@/components/site/icons";
import {
  UserRound,
  Package,
  Layers,
  Scale,
  Gamepad2,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toggleModeFromEvent } from "@/lib/store";

/**
 * DevDock — the developer-mode surface's Docker-style navigation.
 *
 * A Lightswind Dock (macOS magnification) skinned as a container
 * terminal: mono labels, terminal-green active state, a running-dot
 * indicator per section. It replaces the student mode's Rover and is
 * deliberately distinct from everything else on the site — the dev
 * surface navigates like a desktop environment, the student surface
 * plays with a roaming mascot.
 *
 * Scrollspy mirrors the section band. The final item is the mode toggle:
 * its click point becomes the Infinity Fold's origin. (The source.zip
 * download item was removed from the dock by design — the surface now
 * carries navigation and the fold only.)
 */

const SECTIONS: { id: string; label: string; Glyph: LucideIcon }[] = [
  { id: "about", label: "about", Glyph: UserRound },
  { id: "work", label: "work", Glyph: Package },
  { id: "stack", label: "stack", Glyph: Layers },
  { id: "beliefs", label: "laws", Glyph: Scale },
  { id: "quests", label: "quests", Glyph: Gamepad2 },
  { id: "connect", label: "connect", Glyph: Send },
];

export function DevDock() {
  const [active, setActive] = useState("");

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
      ...SECTIONS.map((s) => ({
        id: s.id,
        label: `cd ~/${s.label}`,
        icon: <s.Glyph strokeWidth={1.8} width={20} height={20} />,
        onClick: () => {
          const el = document.getElementById(s.id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.pushState(null, "", `#${s.id}`);
          }
        },
        active: active === s.id,
      })),
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
    <div className="dv-dock" data-active={active || undefined}>
      <Dock
        items={items}
        className="dv-dock-panel"
        baseItemSize={42}
        magnification={62}
        distance={120}
      />
    </div>
  );
}
