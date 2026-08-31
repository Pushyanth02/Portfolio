"use client";

import { useEffect, useState } from "react";

/**
 * useVisualLift — keeps a fixed bottom-anchored element inside the VISIBLE
 * viewport on browsers where the layout viewport extends below the screen
 * edge (the classic case: Chrome Android's collapsing URL bar sitting on
 * top of a `position: fixed` bottom dock — the dock only peeks out when the
 * bar auto-hides and is untappable whenever the bar is shown, which reads
 * to a touch user as "it appears sometimes but stays too low to click").
 *
 * Returns the px that should be ADDED to the element's `bottom` offset:
 *
 *   document.documentElement.clientHeight  (layout viewport height)
 *     − window.visualViewport.height       (visible height)
 *     − window.visualViewport.offsetTop    (visible top edge)
 *
 * clamped at ≥ 0. Desktop browsers and iOS Safari (whose layout viewport
 * itself shrinks under the chrome) report 0 — this is a no-op there and
 * only activates exactly where fixed-bottom elements go blind.
 */
export function useVisualLift(): number {
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const layoutH = document.documentElement.clientHeight;
      const hidden = layoutH - vv.height - vv.offsetTop;
      const next = hidden > 1 ? Math.ceil(hidden) : 0;
      setLift((prev) => (prev === next ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    vv.addEventListener("resize", schedule);
    vv.addEventListener("scroll", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      vv.removeEventListener("resize", schedule);
      vv.removeEventListener("scroll", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

  return lift;
}
