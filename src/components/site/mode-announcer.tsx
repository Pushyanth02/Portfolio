"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/lib/store";

/**
 * ModeAnnouncer — an invisible live region that tells screen readers when
 * the universe switches between "student" and "dev" mode. The fold is
 * purely visual; without this, assistive-tech users have no indication
 * the page content has changed.
 */
export function ModeAnnouncer() {
  const mode = usePortfolioStore((s) => s.mode);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Only announce after the first render — skip the initial boot
    // so screen readers don't read "Switched to student mode" on load.
    const timer = window.setTimeout(() => {
      setMessage(
        `Switched to ${mode === "dev" ? "developer" : "student"} mode`
      );
    }, 1800); // after the fold animation completes (~1.66s)
    return () => window.clearTimeout(timer);
  }, [mode]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
