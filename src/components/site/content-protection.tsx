"use client";

import { useEffect, useRef } from "react";

/**
 * ContentProtection — anti-copy / anti-theft deterrents for the portfolio.
 *
 * What it does (client-side deterrence — nothing in a browser is true DRM):
 *   • disables right-click (context menu)
 *   • blocks copy/cut and replaces the clipboard with an attribution notice
 *   • blocks image/link dragging out of the page
 *   • intercepts view-source / save-page / DevTools shortcuts
 *   • warns (once) if a docked DevTools window is detected
 *   • leaves a console watermark asserting ownership
 *   • DOMAIN LOCK: any deployment outside the authorized hosts gets a
 *     permanent "unauthorized copy" banner — cloned repos brand themselves.
 *
 * Escape hatch: elements marked `[data-allow-copy]` (plus inputs/textareas
 * and contenteditable regions) keep native select/copy behaviour so the
 * site stays accessible.
 */
const AUTHORIZED_HOSTS = ["pushyanth02.github.io", "localhost", "127.0.0.1"];

export function ContentProtection() {
  const lastToastAt = useRef(0);

  useEffect(() => {
    // --- lazy-import sonner toast (keeps this module lean) ---
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let notify = (_msg: string) => {};
    import("sonner").then(({ toast }) => {
      notify = (message: string) => {
        const now = Date.now();
        if (now - lastToastAt.current < 2500) return; // throttle
        lastToastAt.current = now;
        toast(message, { description: "© Pushyanth · all rights reserved" });
      };
    });

    const isExempt = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest(
        "[data-allow-copy], input, textarea, [contenteditable='true'], [contenteditable='']"
      );

    // --- right-click ---
    const onContextMenu = (e: MouseEvent) => {
      if (isExempt(e.target)) return;
      e.preventDefault();
      notify("Right-click is disabled — original work lives here.");
    };

    // --- copy / cut → replace clipboard with attribution ---
    const ATTRIBUTION =
      "Copied from Pushyanth's portfolio — https://pushyanth02.github.io/Portfolio/ — © Pushyanth. Please credit the source.";
    const onCopyCut = (e: ClipboardEvent) => {
      if (isExempt(e.target)) return;
      e.preventDefault();
      e.clipboardData?.setData("text/plain", ATTRIBUTION);
      notify("Copying is disabled — quotes need credit to Pushyanth.");
    };

    // --- dragging images / links out of the page ---
    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
      notify("Assets can't be dragged out of the notebook.");
    };

    // --- shortcut interception: view-source, save page, DevTools ---
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      if (
        e.key === "F12" ||
        (mod && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
        (mod && key === "u")
      ) {
        e.preventDefault();
        notify("View-source & DevTools shortcuts are off.");
        return;
      }
      if (mod && !e.shiftKey && key === "s") {
        e.preventDefault();
        notify("Saving this page is disabled.");
      }
    };

    // --- docked DevTools heuristic (warns once) ---
    let devtoolsWarned = false;
    const checkDevtools = () => {
      if (devtoolsWarned) return;
      const dw = window.outerWidth - window.innerWidth;
      const dh = window.outerHeight - window.innerHeight;
      if (dw > 220 || dh > 220) {
        devtoolsWarned = true;
        console.warn(
          "[Pushyanth] DevTools spotted 👀 This design & content are copyrighted."
        );
      }
    };
    window.addEventListener("resize", checkDevtools);
    checkDevtools();

    // --- console watermark ---
    console.log(
      "%c© Pushyanth ∞ — hand-built, one of one.",
      "color:#e8603c;font-weight:bold;font-size:14px"
    );
    console.log(
      "%cThis site's code, copy & art are copyrighted. Reposting without credit isn't cool.",
      "color:#3e7c4f"
    );

    // --- DOMAIN LOCK: brand unauthorized deployments of cloned repos ---
    let banner: HTMLDivElement | null = null;
    if (!AUTHORIZED_HOSTS.includes(window.location.hostname)) {
      banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.textContent =
        "⚠ Unauthorized deployment — this is a stolen copy. Original: pushyanth02.github.io/Portfolio © Pushyanth";
      banner.setAttribute(
        "style",
        "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:#e8603c;color:#ffffff;font:600 13px/1.4 system-ui,sans-serif;text-align:center;padding:10px 16px;"
      );
      document.body.appendChild(banner);
      console.error(
        "[Pushyanth] ⚠ UNAUTHORIZED DEPLOYMENT detected at",
        window.location.host,
        "— this portfolio is © Pushyanth. Rehosting without written permission is a copyright violation."
      );
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyCut);
    document.addEventListener("cut", onCopyCut);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyCut);
      document.removeEventListener("cut", onCopyCut);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", checkDevtools);
      if (banner) banner.remove();
    };
  }, []);

  return null;
}
