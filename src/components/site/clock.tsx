"use client";

import { useEffect, useState } from "react";

/**
 * Clock — live IST (Asia/Kolkata) time, hydration-safe.
 * Renders a stable placeholder on SSR + first paint, then ticks client-side.
 * Renders into a <span class="clk clock"> so source CSS (.loc-pill .clk) applies.
 */
const istFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function formatIST(d: Date): string {
  return istFormatter.format(d);
}

const PLACEHOLDER = "--:--:--";

export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(PLACEHOLDER);

  useEffect(() => {
    const tick = () => setTime(formatIST(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`clk clock ${className}`} aria-label="Current local time (IST)">
      {time}
    </span>
  );
}
