"use client";

import { useEffect, useMemo, useState } from "react";
import Dock, { type DockItemDef } from "@/components/lightswind/dock";
import { useVisualLift } from "@/components/lightswind/use-visual-lift";
import { Icon } from "@/components/site/icons";
import { sectionGlyphFor, type SectionKey } from "@/components/site/section-icons";
import { toggleModeFromEvent } from "@/lib/store";

/**
 * StudentDock — the student surface's icon navigation.
 *
 * The same Lightswind Dock + the same Lucide icon set as the DevDock
 * (UserRound · Package · Layers · Scale · Award · Send · ∞), so the
 * two universes navigate with identical muscle memory — but skinned as
 * a paper sticker shelf instead of a container terminal (see `st-dock`
 * in student.css: ink borders, offset sticker shadows, per-section warm
 * tints matching the SectionBadge chips).
 *
 * Behaviour parity with the DevDock:
 *  · scrollspy on the same IntersectionObserver band, so the active dot
 *    always agrees with the section badges
 *  · click → smooth scroll + `#section` hash push
 *  · the trailing ∞ item is the Infinity Fold toggle — its click point
 *    becomes the fold origin
 *
 * The Dock base handles every device class on its own: macOS-style
 * magnification only on fine-pointer hover devices, static ≥44px tap
 * targets on touch, keyboard activation (Enter/Space) with focus
 * tooltips, and static sizes under prefers-reduced-motion.
 *
 * The Rover mascot keeps roaming this surface too — the shelf simply
 * sits above it (z-order), so the ∞ slides *under* the dock on its
 * travels instead of covering the icons.
 */

const SECTIONS: { id: string; label: string; sec: SectionKey }[] = [
  { id: "about", label: "the human", sec: "about" },
  { id: "work", label: "shipped work", sec: "work" },
  { id: "stack", label: "the arsenal", sec: "stack" },
  { id: "beliefs", label: "the laws", sec: "laws" },
  { id: "certs", label: "the paper trail", sec: "certs" },
  { id: "connect", label: "let's chat!", sec: "connect" },
];

export function StudentDock() {
  const [active, setActive] = useState("");
  // Touch-safe placement, shared with the DevDock: lifts the fixed frame
  // out from behind collapsing mobile browser chrome so every sticker
  // stays tappable on every device. (No-op on desktop.)
  const lift = useVisualLift();

  // Scrollspy: same observer band as the sections + DevDock, so the
  // badge chips, the dot under the dock tile and the URL always agree.
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
          label: s.label,
          className: `st-sec-${s.sec}`,
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
        label: "flip to dev ∞",
        className: "st-sec-toggle",
        icon: <Icon name="inf" />,
        onClick: (e: React.MouseEvent) => toggleModeFromEvent(e),
      },
    ],
    [active]
  );

  return (
    <div
      className="st-dock"
      data-active={active || undefined}
      style={{ "--vv-lift": `${lift}px` } as React.CSSProperties}
    >
      <Dock
        items={items}
        className="st-dock-panel"
        baseItemSize={42}
        magnification={62}
        distance={120}
      />
    </div>
  );
}
