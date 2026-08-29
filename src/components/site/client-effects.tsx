"use client";

import { useEffect, useRef } from "react";

/**
 * ClientEffects — wires up the scroll/pointer-driven animations that are
 * tied to stable CSS selectors (`.reveal`, `.lm`, `.tilt`,
 * `#progress`, `.impact b[data-num]`). One observer per concern, all cleaned
 * up on unmount. Respects prefers-reduced-motion throughout.
 *
 * Rendered once near the top of the page (after the header). Renders the
 * `#progress` bar and `.noise` overlay itself so the selectors always resolve.
 */
export function ClientEffects() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- scroll reveals (.reveal + .lm) ---
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            revealIO.unobserve(en.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal, .lm:not(.in)").forEach((el) => revealIO.observe(el));

    // --- scroll progress bar (#progress) ---
    // scaleX (compositor-only) instead of width (layout on every scroll frame).
    const prog = progressRef.current;
    let progRaf = 0;
    const updProg = () => {
      if (progRaf) return;
      progRaf = requestAnimationFrame(() => {
        progRaf = 0;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (prog) prog.style.transform = `scaleX(${p.toFixed(4)})`;
      });
    };
    updProg();
    window.addEventListener("scroll", updProg, { passive: true });
    window.addEventListener("resize", updProg, { passive: true });

    // --- count-up stats (.impact b[data-num]) ---
    const numIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          numIO.unobserve(el);
          const target = parseInt(el.dataset.num ?? "0", 10);
          const suf = el.dataset.suffix ?? "";
          if (reduced) {
            el.textContent = target + suf;
            return;
          }
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / 1300);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * e) + suf;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll<HTMLElement>(".impact b[data-num]").forEach((el) => numIO.observe(el));

    // --- 3D tilt cards (.tilt) - rAF throttled & cached bounding rect ---
    const tiltEls = Array.from(document.querySelectorAll<HTMLElement>(".tilt"));
    const tiltCleanups: (() => void)[] = [];
    if (!reduced) {
      tiltEls.forEach((el) => {
        let rect: DOMRect | null = null;
        let tiltRaf = 0;
        let latestEvent: MouseEvent | null = null;

        const enter = () => {
          rect = el.getBoundingClientRect();
        };

        const renderTilt = () => {
          tiltRaf = 0;
          if (!latestEvent || !rect) return;
          const px = (latestEvent.clientX - rect.left) / rect.width - 0.5;
          const py = (latestEvent.clientY - rect.top) / rect.height - 0.5;
          el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
        };

        const move = (e: MouseEvent) => {
          latestEvent = e;
          if (!rect) rect = el.getBoundingClientRect();
          if (!tiltRaf) {
            tiltRaf = requestAnimationFrame(renderTilt);
          }
        };

        const leave = () => {
          latestEvent = null;
          rect = null;
          if (tiltRaf) {
            cancelAnimationFrame(tiltRaf);
            tiltRaf = 0;
          }
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };

        el.addEventListener("mouseenter", enter, { passive: true });
        el.addEventListener("mousemove", move, { passive: true });
        el.addEventListener("mouseleave", leave, { passive: true });

        tiltCleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
          if (tiltRaf) cancelAnimationFrame(tiltRaf);
        });
      });
    }

    return () => {
      revealIO.disconnect();
      numIO.disconnect();
      if (progRaf) cancelAnimationFrame(progRaf);
      window.removeEventListener("scroll", updProg);
      window.removeEventListener("resize", updProg);
      tiltCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div id="progress" ref={progressRef} aria-hidden="true" />
      <a className="skip" href="#work">skip to work</a>
    </>
  );
}
