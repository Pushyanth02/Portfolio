"use client";

import { useEffect, useRef } from "react";

/**
 * Rover — the roaming infinity symbol.
 *
 * Movement: picks nearby targets (random angle + bounded distance from the
 * current position) so it wanders locally rather than zipping across the whole
 * viewport. Each candidate is collision-checked against text via
 * `document.elementsFromPoint` — the rover never *parks* on top of readable
 * text (paragraphs, headings, links, list items, labels, etc.). Transits may
 * briefly cross text but targets are always clear gaps.
 *
 * Click: triggers a cute reaction — the infinity does a happy bounce+spin
 * ("boing"), a burst of heart / star / ∞ particles flies outward, and a tiny
 * speech bubble floats up with a random greeting. Then it wanders to a new
 * clear spot.
 *
 * Disabled entirely under prefers-reduced-motion (CSS hides #rover).
 */

const TEXT_TAGS = new Set([
  "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "A", "BUTTON", "LABEL",
  "BLOCKQUOTE", "TD", "TH", "CODE", "PRE", "B", "STRONG", "EM", "SMALL",
  "TIME", "FIGCAPTION", "SPAN", "INPUT", "TEXTAREA", "SELECT",
]);

const GLYPHS = ["♥", "★", "✦", "∞"];
const COLORS = ["#E8603C", "#F2B33D", "#3E7C4F", "#FBF6EC"];
const BUBBLES = ["hi!", "hello!", "∞", "boo!", "yay!", "ping!", "hey!", "👋"];

export function Rover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rover = ref.current;
    if (!rover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = {
      x: window.innerWidth * 0.78,
      y: window.innerHeight * 0.32,
      tx: 0,
      ty: 0,
      next: 0,
      lt: 0,
    };

    // Does a 40px box around (x,y) overlap any readable text element?
    const isBlocked = (x: number, y: number): boolean => {
      const samples = [
        [x, y],
        [x - 22, y - 22],
        [x + 22, y - 22],
        [x - 22, y + 22],
        [x + 22, y + 22],
      ];
      for (const [px, py] of samples) {
        if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) continue;
        const els = document.elementsFromPoint(px, py);
        for (const el of els) {
          const id = el.id;
          if (id === "rover" || id === "progress" || id === "top") continue;
          const cn = typeof el.className === "string" ? el.className : "";
          if (
            cn.includes("trail-dot") || cn.includes("spark") || cn.includes("pop") ||
            cn.includes("bub") || cn.includes("noise") || cn.includes("skip") ||
            cn.includes("rover")
          ) continue;
          if (TEXT_TAGS.has(el.tagName)) return true;
        }
      }
      return false;
    };

    // Pick a nearby clear target — wander locally, never park on text.
    const pick = () => {
      const m = 90;
      const top = 110;
      const bottom = window.innerHeight - 130;
      for (let i = 0; i < 22; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 150 + Math.random() * 320;
        let cx = state.x + Math.cos(ang) * dist;
        let cy = state.y + Math.sin(ang) * dist;
        cx = Math.max(m, Math.min(window.innerWidth - m, cx));
        cy = Math.max(top, Math.min(bottom, cy));
        if (!isBlocked(cx, cy)) {
          state.tx = cx;
          state.ty = cy;
          return;
        }
      }
      // Fallback: nudge toward a margin if everything is blocked.
      state.tx = Math.max(m, Math.min(window.innerWidth - m, state.x + 80));
      state.ty = Math.max(top, Math.min(bottom, state.y - 80));
    };
    pick();
    state.next = performance.now() + 4000;

    let raf = 0;
    let isHidden = false;

    const loop = (t: number) => {
      if (isHidden) return;

      const dx = state.tx - state.x;
      const dy = state.ty - state.y;
      const dist = Math.hypot(dx, dy);
      state.x += dx * 0.014;
      state.y += dy * 0.014;
      const rot = Math.sin(t / 650) * 22 + Math.max(-18, Math.min(18, dx * 0.12));
      rover.style.transform = `translate(${state.x.toFixed(1)}px, ${state.y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;

      if (dist < 46 || t > state.next) {
        pick();
        state.next = t + 3400 + Math.random() * 4000;
      }

      // Fading coral trail.
      if (dist > 6 && t - state.lt > 230) {
        state.lt = t;
        const td = document.createElement("span");
        td.className = "trail-dot";
        td.style.left = `${state.x + 14}px`;
        td.style.top = `${state.y + 14}px`;
        document.body.appendChild(td);
        window.setTimeout(() => td.remove(), 950);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibilityChange = () => {
      if (document.hidden) {
        isHidden = true;
        cancelAnimationFrame(raf);
      } else {
        isHidden = false;
        state.next = performance.now() + 2000;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      const m = 90;
      state.x = Math.max(m, Math.min(window.innerWidth - m, state.x));
      state.y = Math.max(110, Math.min(window.innerHeight - 130, state.y));
      pick();
    };
    window.addEventListener("resize", onResize);

    // Re-pick on scroll (the viewport's text layout changes under the fixed rover).
    let scrollTimer = 0;
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (isBlocked(state.x, state.y)) pick();
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- cute click reaction ---
    const onClick = () => {
      // 1. wander to a fresh clear spot
      pick();

      // 2. boing: restart the svg bounce+spin animation
      rover.classList.remove("boing");
      void rover.offsetWidth; // force reflow so the class re-triggers
      rover.classList.add("boing");
      window.setTimeout(() => rover.classList.remove("boing"), 720);

      const cx = state.x + 17;
      const cy = state.y + 17;

      // 3. burst of heart / star / ∞ particles
      for (let i = 0; i < 14; i++) {
        const p = document.createElement("span");
        p.className = "pop";
        const a = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
        const dd = 46 + Math.random() * 74;
        p.style.left = `${cx - 10}px`;
        p.style.top = `${cy - 10}px`;
        p.style.color = COLORS[i % COLORS.length];
        p.style.setProperty("--dx", `${(Math.cos(a) * dd).toFixed(1)}px`);
        p.style.setProperty("--dy", `${(Math.sin(a) * dd).toFixed(1)}px`);
        p.style.setProperty("--rr", `${Math.random() * 360 - 180}deg`);
        p.textContent = GLYPHS[i % GLYPHS.length];
        document.body.appendChild(p);
        window.setTimeout(() => p.remove(), 1000);
      }

      // 4. a tiny speech bubble with a random greeting
      const b = document.createElement("span");
      b.className = "bub";
      b.textContent = BUBBLES[Math.floor(Math.random() * BUBBLES.length)];
      b.style.left = `${cx}px`;
      b.style.top = `${cy}px`;
      document.body.appendChild(b);
      window.setTimeout(() => b.remove(), 1550);
    };
    rover.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      rover.removeEventListener("click", onClick);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <div id="rover" ref={ref} aria-hidden="true" title="∞ — click me">
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
        <defs>
          <linearGradient id="rgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8603C" />
            <stop offset="1" stopColor="#F2B33D" />
          </linearGradient>
        </defs>
        <path
          d="M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z"
          stroke="url(#rgrad)"
          strokeWidth="2.6"
        />
      </svg>
    </div>
  );
}
