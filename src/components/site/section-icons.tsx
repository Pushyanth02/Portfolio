import { memo } from "react";
import {
  UserRound,
  Package,
  Layers,
  Scale,
  Gamepad2,
  Send,
  type LucideIcon,
} from "lucide-react";

/**
 * SectionBadge — the unified section-icon system.
 *
 * One icon set across BOTH universes (the student surface previously had
 * no section icons; the dev surface only had sprite icons in the dock):
 *
 *   · student skin — sticker chip: hard ink border, offset shadow,
 *     hand-set rotation, per-section warm tint + accent
 *   · dev skin     — terminal chip: phosphor-green glyph, `~/label`
 *     path prefix, soft glow (scoped via `html.dev .sec-ic` in dev.css)
 *
 * Same glyph per section in both modes so the two surfaces read as
 * deliberate mirrors of each other.
 */

export type SectionKey = "about" | "work" | "stack" | "laws" | "quests" | "connect";

const ICONS: Record<SectionKey, LucideIcon> = {
  about: UserRound,
  work: Package,
  stack: Layers,
  laws: Scale,
  quests: Gamepad2,
  connect: Send,
};

const LABELS: Record<SectionKey, string> = {
  about: "about",
  work: "work",
  stack: "stack",
  laws: "laws",
  quests: "quests",
  connect: "connect",
};

/** Map a section id to its badge key (e.g. "beliefs" → "laws"). */
const ID_ALIAS: Record<string, SectionKey> = { beliefs: "laws" };

export function sectionKeyFor(id: string): SectionKey {
  return ID_ALIAS[id] ?? (id as SectionKey);
}

export const SectionBadge = memo(function SectionBadge({
  id,
  className,
}: {
  id: SectionKey;
  className?: string;
}) {
  const Glyph = ICONS[id];
  return (
    <span className={`sec-ic${className ? ` ${className}` : ""}`} data-sec={id}>
      <Glyph aria-hidden="true" strokeWidth={1.8} />
      <span className="sec-ic-label">{LABELS[id]}</span>
    </span>
  );
});
