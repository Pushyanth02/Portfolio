"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Dock, { type DockItemDef } from "@/components/lightswind/dock";
import { Icon, type IconName } from "@/components/site/icons";
import { assetUrl } from "@/lib/utils";

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
 * Scrollspy mirrors the header's observer band. The final item is the
 * mode toggle: its click point becomes the Infinity Fold's origin. The
 * download item serves the source snapshot at public/Portfolio-source.zip
 * (regenerate with scripts/package-source.sh before deploys).
 */

const SECTIONS: { id: string; label: string; icon: IconName }[] = [
  { id: "about", label: "about", icon: "id" },
  { id: "work", label: "work", icon: "cube" },
  { id: "stack", label: "stack", icon: "chip" },
  { id: "beliefs", label: "laws", icon: "check" },
  { id: "quests", label: "quests", icon: "rocket" },
  { id: "connect", label: "connect", icon: "mail" },
];

interface DevDockProps {
  onToggleMode?: (e?: React.MouseEvent) => void;
}

export function DevDock({ onToggleMode }: DevDockProps) {
  const [active, setActive] = useState("");

  // Scrollspy: same observer band as the header, so dock + nav agree.
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
        icon: <Icon name={s.icon} />,
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
        id: "download-source",
        label: "curl -O source.zip",
        icon: <Icon name="dl" />,
        onClick: () => {
          const a = document.createElement("a");
          a.href = assetUrl("/Portfolio-source.zip");
          a.download = "Portfolio-source.zip";
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast.success("Downloading source archive", {
            description: "Portfolio-source.zip · static snapshot",
            duration: 2500,
          });
        },
      },
      {
        id: "mode-toggle",
        label: "fold → student.env",
        icon: <Icon name="inf" />,
        onClick: (e) => onToggleMode?.(e),
      },
    ],
    [active, onToggleMode]
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
