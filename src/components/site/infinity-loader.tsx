"use client";

import { useEffect, useState } from "react";

/**
 * InfinityLoader — a full-screen loading overlay shown during initial page
 * hydration. Fades in after a short delay (avoids flash on fast loads) and
 * fades out once the page signals readiness.
 *
 * The infinity glyph draws itself (stroke-dashoffset animation), pulses with
 * a warm coral glow, and the brand name types in beneath — all in the
 * notebook aesthetic (cream background, ink borders, coral accents).
 */
export function InfinityLoader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");

  useEffect(() => {
    // Short delay before showing — avoids flash on fast connections
    const showTimer = window.setTimeout(() => {
      setPhase("idle");
    }, 60);

    // Minimum display time so the animation feels intentional, not a flicker
    const minTimer = window.setTimeout(() => {
      setPhase("exit");
    }, 800);

    // Fully remove after fade-out completes
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
    }, 1300);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`infinity-loader ${phase}`}
      aria-label="Loading"
      role="status"
    >
      <div className="il-inner">
        {/* Infinity glyph — stroke-draw animation */}
        <div className="il-glyph">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="ilGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E8603C" />
                <stop offset="1" stopColor="#F2B33D" />
              </linearGradient>
            </defs>
            <path
              className="il-path"
              d="M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z"
              stroke="url(#ilGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* Glow ring */}
        <div className="il-ring" aria-hidden="true" />
        {/* Brand text */}
        <p className="il-text">
          pushyanth<span className="il-accent">∞</span>
        </p>
      </div>
    </div>
  );
}
