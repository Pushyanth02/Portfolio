"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LazyMount — viewport-aware mount gate for heavy children (the Originkit
 * WebGL / canvas fields).
 *
 * Three jobs, in priority order:
 *
 * 1. DEFER past first paint. A mode warp remounts the whole tree; without
 *    the initial delay the canvas engines would initialise mid-transition
 *    and stall the main thread for hundreds of ms.
 * 2. MOUNT ONLY NEAR THE VIEWPORT. The field initialises once its section
 *    is inside the viewport band, and unmounts when it scrolls far away
 *    (outside a ~70% margin on both sides). Previously every WebGL field
 *    ran its rAF loop forever: a student page kept two GL contexts and a
 *    dev page kept three alive even while reading the footer. The generous
 *    far margin prevents mount/unmount thrash when scrolling slowly around
 *    the boundary; re-entering the band re-mounts off-screen, so the
 *    shader-compile cost never lands while a field is visible.
 * 3. HOLD DURING WARPS. While the mode warp runs, mounted fields unmount
 *    immediately (the gate covers them anyway, and tearing down the old GL
 *    contexts before the new tree mounts removes the back-to-back
 *    context create/destroy stall that made the swap stutter). Mounting
 *    resumes after the warp ends, so the reveal never competes with
 *    canvas initialisation.
 *
 * The placeholder cross-fades in the real field once mounted.
 */

/** Module-level warp flag + listeners (no React context needed). */
let warpActive = false;
const warpListeners = new Set<() => void>();

function subscribeWarp(listener: () => void): () => void {
  warpListeners.add(listener);
  return () => {
    warpListeners.delete(listener);
  };
}

export function notifyWarpBegin() {
  warpActive = true;
  warpListeners.forEach((l) => l());
}

export function notifyWarpEnd() {
  warpActive = false;
  warpListeners.forEach((l) => l());
}

export function LazyMount({
  children,
  delay = 140,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  // "near" = the section is inside the viewport band (with hysteresis).
  const [near, setNear] = useState(false);
  // mirrors the module-level warp flag for this instance
  const [warped, setWarped] = useState(warpActive);
  // "booted" = the first-mount delay has elapsed at least once; later
  // re-entries (scroll, post-warp) mount immediately.
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const unsub = subscribeWarp(() => setWarped(warpActive));
    return unsub;
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            setNear(true);
          } else if (en.intersectionRatio === 0) {
            // fully outside even the generous far margin → unmount the field
            setNear(false);
          }
        }
      },
      // near band: viewport extended by ~70% of its height above and below
      { rootMargin: "70% 0px 70% 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  // First mount waits out the delay so it never lands mid-first-paint.
  useEffect(() => {
    if (!near || warped || booted) return;
    const id = window.setTimeout(() => setBooted(true), delay);
    return () => window.clearTimeout(id);
  }, [near, warped, booted, delay]);

  const ready = near && !warped && booted;

  return (
    <div
      ref={nodeRef}
      className={`lazy-mount${className ? ` ${className}` : ""}`}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    >
      {ready ? children : null}
    </div>
  );
}
