"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Clock — live IST (Asia/Kolkata) time, hydration-safe.
 *
 * A single module-level interval drives every <Clock /> instance on the page
 * (hero + footer), so there is exactly one timer instead of one per mount.
 * Renders a stable placeholder on SSR + first paint, then ticks client-side.
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

// --- shared ticker (module scope) ---
let current = PLACEHOLDER;
let started = false;
const listeners = new Set<() => void>();

function startTicker() {
  if (started) return;
  started = true;
  current = formatIST(new Date());
  window.setInterval(() => {
    current = formatIST(new Date());
    listeners.forEach((l) => l());
  }, 1000);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function Clock({ className = "" }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => current,
    () => PLACEHOLDER,
  );

  useEffect(() => {
    startTicker();
  }, []);

  return (
    <span
      className={`clk clock ${className}`}
      aria-label="Current local time (IST)"
    >
      {time}
    </span>
  );
}
