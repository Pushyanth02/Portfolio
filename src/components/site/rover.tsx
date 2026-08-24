"use client";

import { useEffect, useRef } from "react";

/**
 * Rover — the roaming infinity symbol.
 *
 * Movement:
 * 1. Freely wanders around the website, picking nearby clear spots via collision
 *    detection against text tags (`document.elementsFromPoint`).
 * 2. Docking at Connect: As soon as the user enters the `#connect` section, the
 *    rover glides into the `#connect-rover-dock` anchor right above "let's chat!".
 *    While the user is in Connect, the rover stays docked and tracks the anchor
 *    on scroll.
 * 3. Lift-off: When the user scrolls back up away from Connect, the rover
 *    smoothly undocks, picks a wandering waypoint in the viewport, and resumes
 *    freely roaming.
 *
 * Click: triggers a happy bounce+spin ("boing"), an outward burst of particles,
 * and a speech bubble with a playful greeting.
 *
 * Disabled entirely under prefers-reduced-motion (CSS hides #rover).
 *
 * Performance notes:
 * - Dock geometry is cached and refreshed on scroll/resize (rAF-throttled) plus
 *   a slow fallback tick — never inside the animation loop. This avoids forcing
 *   layout reads (`getBoundingClientRect`) every frame.
 * - Collision checks use 3 sample points instead of 5 to cut `elementsFromPoint`
 *   layout reads.
 * - Trail dots are pooled and reused instead of allocating + GC-ing every tick.
 */

const TEXT_TAGS = new Set([
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
  "A",
  "BUTTON",
  "LABEL",
  "BLOCKQUOTE",
  "TD",
  "TH",
  "CODE",
  "PRE",
  "B",
  "STRONG",
  "EM",
  "SMALL",
  "TIME",
  "FIGCAPTION",
  "SPAN",
  "INPUT",
  "TEXTAREA",
  "SELECT",
]);

const GLYPHS = ["♥", "★", "✦", "∞", "✨", "💬"];
const COLORS = ["#E8603C", "#F2B33D", "#3E7C4F", "#FBF6EC", "#FFFFFF"];
const BUBBLES = [
  "let's chat!",
  "let's build!",
  "hi!",
  "hello!",
  "∞",
  "yay!",
  "ping!",
  "hey!",
  "👋",
];

export function Rover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rover = ref.current;
    if (!rover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type RoverMode = "wander" | "docking" | "docked" | "liftoff";

    const state = {
      x: window.innerWidth * 0.78,
      y: window.innerHeight * 0.32,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0,
      rot: 0,
      next: 0,
      lt: 0,
      mode: "wander" as RoverMode,
      liftoffUntil: 0,
    };

    // Does a 40px box around (x,y) overlap any readable text element?
    // 3 sample points (center + two corners) — fewer `elementsFromPoint` reads.
    const isBlocked = (x: number, y: number): boolean => {
      const samples = [
        [x, y],
        [x - 22, y - 22],
        [x + 22, y + 22],
      ];
      for (const [px, py] of samples) {
        if (
          px < 0 ||
          py < 0 ||
          px > window.innerWidth ||
          py > window.innerHeight
        )
          continue;
        const els = document.elementsFromPoint(px, py);
        for (const el of els) {
          const id = el.id;
          if (
            id === "rover" ||
            id === "progress" ||
            id === "top" ||
            id === "connect-rover-dock"
          )
            continue;
          const cn = typeof el.className === "string" ? el.className : "";
          if (
            cn.includes("trail-dot") ||
            cn.includes("spark") ||
            cn.includes("pop") ||
            cn.includes("bub") ||
            cn.includes("noise") ||
            cn.includes("skip") ||
            cn.includes("rover") ||
            cn.includes("dock")
          )
            continue;
          if (TEXT_TAGS.has(el.tagName)) return true;
        }
      }
      return false;
    };

    // Pick a nearby clear target — wander locally, never park on text.
    const pick = () => {
      const m = 80;
      const top = 100;
      const bottom = window.innerHeight - 120;
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 240;
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
    state.next = performance.now() + 4500;

    let raf = 0;
    let isHidden = false;
    let lastT = performance.now();

    // Resolve dock targets and rover size once — per-frame getElementById +
    // offsetWidth reads force layout recalcs every tick.
    const dockEl = document.getElementById("connect-rover-dock");
    const connectEl = document.getElementById("connect");
    const roverW = rover.offsetWidth || 36;
    const roverH = rover.offsetHeight || 36;

    type DockInfo = {
      inConnect: boolean;
      dockX: number;
      dockY: number;
      centerX: number;
      centerY: number;
    };
    const NO_DOCK: DockInfo = {
      inConnect: false,
      dockX: 0,
      dockY: 0,
      centerX: 0,
      centerY: 0,
    };

    // Cached dock geometry: recomputed on scroll/resize (rAF-throttled) or a
    // slow fallback tick — never every frame. This keeps docked tracking smooth
    // without forcing layout reads inside the animation loop.
    let dockInfo: DockInfo = NO_DOCK;
    let dockDirty = true;
    let lastDockCheck = 0;

    const refreshDock = () => {
      if (!dockEl || !connectEl) {
        dockInfo = NO_DOCK;
        return;
      }
      const cRect = connectEl.getBoundingClientRect();
      const dRect = dockEl.getBoundingClientRect();
      const inView =
        cRect.top < window.innerHeight * 0.88 &&
        cRect.bottom > 64 &&
        dRect.bottom > 64;
      dockInfo = {
        inConnect: inView,
        dockX: dRect.left + (dRect.width - roverW) / 2,
        dockY: dRect.top + (dRect.height - roverH) / 2,
        centerX: dRect.left + dRect.width / 2,
        centerY: dRect.top + dRect.height / 2,
      };
    };

    let dockRaf = 0;
    const scheduleDockRefresh = () => {
      if (dockRaf) return;
      dockRaf = requestAnimationFrame(() => {
        dockRaf = 0;
        refreshDock();
      });
    };

    // Trail-dot pool — reuse spans instead of allocating + GC-ing every tick.
    const trailPool: HTMLSpanElement[] = [];
    const spawnTrail = () => {
      const td = trailPool.pop() ?? document.createElement("span");
      td.className = "trail-dot";
      td.style.left = `${state.x + 14}px`;
      td.style.top = `${state.y + 14}px`;
      document.body.appendChild(td);
      window.setTimeout(() => {
        td.remove();
        trailPool.push(td);
      }, 950);
    };

    const loop = (t: number) => {
      if (isHidden) return;

      const dt = Math.min(Math.max((t - lastT) / 1000, 0.001), 0.1);
      lastT = t;

      // Refresh cached dock geometry on a slow fallback tick while roaming;
      // while docking/docked, scroll/resize events keep it fresh.
      if (dockDirty || t - lastDockCheck > 500) {
        refreshDock();
        dockDirty = false;
        lastDockCheck = t;
      }

      const { inConnect, dockX, dockY, centerX, centerY } = dockInfo;

      if (inConnect) {
        // --- DOCKING / DOCKED MODE ---
        if (state.mode === "wander" || state.mode === "liftoff") {
          state.mode = "docking";
        }

        if (state.mode === "docking") {
          state.tx = dockX;
          state.ty = dockY;

          // Gentle exponential magnetic convergence into dock (half the old rate)
          const k = 4.5;
          const factor = 1 - Math.exp(-k * dt);
          state.x += (dockX - state.x) * factor;
          state.y += (dockY - state.y) * factor;

          const dist = Math.hypot(dockX - state.x, dockY - state.y);
          const targetRot = Math.sin(t / 900) * 3;
          state.rot += (targetRot - state.rot) * (1 - Math.exp(-4 * dt));

          rover.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rot.toFixed(2)}deg)`;

          if (dist < 2.5) {
            state.mode = "docked";
            state.x = dockX;
            state.y = dockY;
            rover.classList.add("docked");
            if (dockEl) dockEl.classList.add("rover-settled");

            // Tactile landing ripple
            const rip = document.createElement("span");
            rip.className = "dock-ripple";
            rip.style.left = `${centerX}px`;
            rip.style.top = `${centerY}px`;
            document.body.appendChild(rip);
            window.setTimeout(() => rip.remove(), 700);

            // Soft landing settle bounce
            rover.classList.remove("settle");
            void rover.offsetWidth;
            rover.classList.add("settle");
            window.setTimeout(() => rover.classList.remove("settle"), 550);
          }
        } else if (state.mode === "docked") {
          // Zero-lag tracking of dock position on scroll + gentle organic breathing
          const breathY = Math.sin(t / 1000) * 1.2;
          state.x = dockX;
          state.y = dockY + breathY;

          const idleRot = Math.sin(t / 900) * 3;
          state.rot += (idleRot - state.rot) * (1 - Math.exp(-5 * dt));

          rover.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rot.toFixed(2)}deg)`;

          if (!rover.classList.contains("docked"))
            rover.classList.add("docked");
          if (dockEl && !dockEl.classList.contains("rover-settled"))
            dockEl.classList.add("rover-settled");
        }
      } else {
        // --- UNDOCKED / WANDERING / LIFTOFF MODE ---
        if (state.mode === "docked" || state.mode === "docking") {
          // Just left Connect: initiate graceful buoyant liftoff
          state.mode = "liftoff";
          state.liftoffUntil = t + 1100;
          rover.classList.remove("docked");
          if (dockEl) dockEl.classList.remove("rover-settled");

          // Initial liftoff impulse upward and away (half the old speed)
          const dir = state.x > window.innerWidth * 0.5 ? -1 : 1;
          state.vx = dir * (50 + Math.random() * 30);
          state.vy = -90 - Math.random() * 30;
          pick();
          state.next = t + 4200 + Math.random() * 3600;
        }

        if (state.mode === "liftoff") {
          // Smooth liftoff physics transitioning into wandering
          state.vx *= Math.exp(-2 * dt);
          state.vy *= Math.exp(-2 * dt);
          state.x += state.vx * dt;
          state.y += state.vy * dt;

          const blend = 1 - Math.exp(-1.1 * dt);
          state.x += (state.tx - state.x) * blend;
          state.y += (state.ty - state.y) * blend;

          const dx = state.tx - state.x;
          const waveRot =
            Math.sin(t / 800) * 14 + Math.max(-14, Math.min(14, dx * 0.08));
          state.rot += (waveRot - state.rot) * (1 - Math.exp(-3 * dt));

          rover.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rot.toFixed(2)}deg)`;

          if (t > state.liftoffUntil) {
            state.mode = "wander";
          }
        } else {
          // Free wandering mode — half the old speed
          const wanderRate = 1 - Math.exp(-1.5 * dt);
          state.x += (state.tx - state.x) * wanderRate;
          state.y += (state.ty - state.y) * wanderRate;

          const dx = state.tx - state.x;
          const dy = state.ty - state.y;
          const dist = Math.hypot(dx, dy);

          const targetTilt = Math.max(-14, Math.min(14, dx * 0.08));
          const waveRot = Math.sin(t / 800) * 14 + targetTilt;
          state.rot += (waveRot - state.rot) * (1 - Math.exp(-3 * dt));

          rover.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rot.toFixed(2)}deg)`;

          if (dist < 40 || t > state.next) {
            pick();
            state.next = t + 4200 + Math.random() * 3800;
          }

          // Fading coral trail (only when moving in wandering mode)
          if (dist > 6 && t - state.lt > 150) {
            state.lt = t;
            spawnTrail();
          }
        }
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
        lastT = performance.now();
        state.next = performance.now() + 4000;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      const m = 80;
      state.x = Math.max(m, Math.min(window.innerWidth - m, state.x));
      state.y = Math.max(100, Math.min(window.innerHeight - 120, state.y));
      dockDirty = true;
      scheduleDockRefresh();
      if (state.mode === "wander") pick();
    };
    window.addEventListener("resize", onResize);

    // Re-pick on scroll when roaming if blocked
    let scrollTimer = 0;
    const onScroll = () => {
      scheduleDockRefresh();
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (state.mode === "wander" && isBlocked(state.x, state.y)) {
          pick();
        }
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- cute click reaction ---
    const onClick = () => {
      // If wandering, pick a fresh spot
      if (state.mode === "wander") {
        pick();
      }

      // boing: restart the bounce+spin animation
      rover.classList.remove("boing");
      void rover.offsetWidth; // force reflow
      rover.classList.add("boing");
      window.setTimeout(() => rover.classList.remove("boing"), 720);

      const cx = state.x + 18;
      const cy = state.y + 18;

      // burst of heart / star / ∞ particles
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

      // tiny speech bubble with a greeting
      const b = document.createElement("span");
      b.className = "bub";
      b.textContent = BUBBLES[Math.floor(Math.random() * BUBBLES.length)];
      b.style.left = `${cx}px`;
      b.style.top = `${cy}px`;
      document.body.appendChild(b);
      window.setTimeout(() => b.remove(), 1550);
    };

    rover.addEventListener("click", onClick);

    // Also bind click on dock element so clicking the pad triggers the reaction
    // (and Enter/Space now that the dock is keyboard-focusable).
    const onDockKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };
    if (dockEl) {
      dockEl.addEventListener("click", onClick);
      dockEl.addEventListener("keydown", onDockKey);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (dockRaf) cancelAnimationFrame(dockRaf);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      rover.removeEventListener("click", onClick);
      if (dockEl) {
        dockEl.removeEventListener("click", onClick);
        dockEl.removeEventListener("keydown", onDockKey);
      }
      window.clearTimeout(scrollTimer);
      trailPool.forEach((td) => td.remove());
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
