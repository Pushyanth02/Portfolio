import { memo } from "react";

type MarqueeProps = {
  variant?: "coral" | "green";
  items: string[]; // each rendered with an ∞ separator by the caller
};

/**
 * Marquee — endless horizontal strip. Duplicated track for a seamless -50% loop.
 * Pauses on hover (handled in CSS). Hidden from AT (decorative).
 */
export const Marquee = memo(function Marquee({ variant = "coral", items }: MarqueeProps) {
  const track = (
    <span>
      {items.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", gap: 34, paddingRight: 34 }}>
          {t} <b>∞</b>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`marquee${variant === "green" ? " green" : ""}`} aria-hidden="true">
      <div className="mq-track">
        {track}
        {track}
      </div>
    </div>
  );
});
