"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Icon } from "./icons";
import { assetUrl } from "@/lib/utils";
import { toast } from "sonner";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ResumeModal — the resume viewer.
 *
 * PDF delivery is browser-proof by design:
 *
 * 1. On open, the PDF is fetched once and turned into a Blob URL. Blob
 *    URLs render in iframes and download via anchors in every mainstream
 *    engine (including Edge) because they bypass proxy/gateway rewrites,
 *    MIME sniffing and navigation interception that sometimes break a
 *    direct /file.pdf navigation.
 * 2. If the fetch fails (offline, odd host), the viewer falls back to the
 *    direct URL — and if the iframe still hasn't painted within a grace
 *    window, it auto-switches to the Clean (HTML) view with a toast, so
 *    the resume is always readable.
 * 3. Downloads always go through a programmatic anchor with the `download`
 *    attribute — the one path Edge/Chrome/Firefox/Safari all honour.
 *
 * The backdrop is intentionally NOT backdrop-filtered (see globals.css).
 */
export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<"pdf" | "clean">("pdf");
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const iframeLoadedRef = useRef(false);

  const pdfUrl = assetUrl("/Pushyanth_Reddy_Resume.pdf");

  // Fetch the PDF as a Blob once per open; fall back to the direct URL.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    iframeLoadedRef.current = false;

    setPdfSrc(null);
    (async () => {
      try {
        const res = await fetch(pdfUrl, { cache: "force-cache" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const blob = await res.blob();
        if (blob.size < 512) throw new Error("suspiciously small");
        if (cancelled) return;
        objectUrl = URL.createObjectURL(
          blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" })
        );
        setPdfSrc(objectUrl);
      } catch {
        // Direct URL is still worth a shot in most environments.
        if (!cancelled) setPdfSrc(pdfUrl);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, pdfUrl]);

  // If the iframe never paints, the browser is blocking embedded PDFs —
  // flip to the Clean view so the resume is never a dead end.
  useEffect(() => {
    if (!isOpen || activeTab !== "pdf" || !pdfSrc) return;
    const t = window.setTimeout(() => {
      if (!iframeLoadedRef.current) {
        setActiveTab("clean");
        toast.info("Switched to Clean View", {
          description: "This browser blocked the embedded PDF. The clean view always works.",
          duration: 4000,
        });
      }
    }, 3500);
    return () => window.clearTimeout(t);
  }, [isOpen, activeTab, pdfSrc]);

  // Lock background scrolling when modal is active
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Programmatic anchor download — honoured by Edge, Chrome, Firefox, Safari.
  const handleDownload = useCallback(() => {
    const src = pdfSrc ?? pdfUrl;
    const a = document.createElement("a");
    a.href = src;
    a.download = "Pushyanth_Reddy_Resume.pdf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Downloading Resume PDF", {
      description: "Pushyanth_Reddy_Resume.pdf",
      duration: 2500,
    });
  }, [pdfSrc, pdfUrl]);

  // Open in a new tab. Blob URLs open fine everywhere; direct URLs only if
  // the host serves them — try the blob first, direct as fallback.
  const handleOpenTab = useCallback(() => {
    const src = pdfSrc ?? pdfUrl;
    const win = window.open(src, "_blank", "noopener,noreferrer");
    if (!win) {
      // Popup blocked → behave like a download instead of dead-ending.
      toast.info("Pop-up blocked, downloading instead", { duration: 3000 });
      handleDownload();
    }
  }, [pdfSrc, pdfUrl, handleDownload]);

  if (!isOpen) return null;

  return (
    <>
      {/* ============ INFINITY DRAW-IN CURTAIN ============ */}
      <div className="infinity-slide-overlay" aria-hidden="true">
        <div className="iso-panel iso-top" />
        <div className="iso-panel iso-bottom" />
        <div className="iso-center">
          <svg
            className="iso-inf"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
          >
            <path
              className="iso-inf-path"
              d="M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z"
            />
          </svg>
          <span className="iso-ring" />
        </div>
      </div>
      {/* ============ RESUME MODAL DIALOG ============ */}
      <div
        className="resume-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
      >
        <div className="resume-card">
          {/* Header Bar */}
          <div className="resume-header">
            <div className="rh-left">
              <span className="rh-badge">
                <span className="rh-inf">
                  <Icon name="inf" />
                </span>
                RESUME
              </span>
              <div>
                <h3 id="resume-title" className="rh-name">
                  Vulavala Pushyanth Reddy
                </h3>
                <p className="rh-sub">
                  CS Undergrad · Full-Stack Developer · Bangalore, India
                </p>
              </div>
            </div>

            {/* View Switcher */}
            <div className="rh-tabs">
              <button
                type="button"
                className={`rh-tab ${activeTab === "pdf" ? "active" : ""}`}
                onClick={() => setActiveTab("pdf")}
              >
                PDF View
              </button>
              <button
                type="button"
                className={`rh-tab ${activeTab === "clean" ? "active" : ""}`}
                onClick={() => setActiveTab("clean")}
              >
                Clean View
              </button>
            </div>

            {/* Header Actions */}
            <div className="rh-actions">
              <button
                type="button"
                onClick={handleOpenTab}
                className="rh-btn rh-btn-ghost"
                title="Open PDF in a new browser tab"
              >
                Open ↗
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rh-btn rh-btn-primary"
                title="Download PDF"
              >
                Download PDF ⬇
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rh-btn rh-btn-close"
                aria-label="Close resume dialog"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="resume-body">
            {activeTab === "pdf" ? (
              <div className="resume-pdf-frame">
                {pdfSrc ? (
                  <iframe
                    src={pdfSrc}
                    title="Vulavala Pushyanth Reddy Resume PDF"
                    className="pdf-viewer"
                    onLoad={() => {
                      iframeLoadedRef.current = true;
                    }}
                  />
                ) : (
                  <div className="pdf-mobile-fallback">
                    <p>Loading the PDF…</p>
                    <div className="pmf-actions">
                      <button
                        type="button"
                        className="rh-btn rh-btn-primary"
                        onClick={handleDownload}
                      >
                        Download PDF ⬇
                      </button>
                      <button
                        type="button"
                        className="rh-btn rh-btn-ghost"
                        onClick={() => setActiveTab("clean")}
                      >
                        Switch to Clean View
                      </button>
                    </div>
                  </div>
                )}
                <div className="pdf-mobile-fallback">
                  <p>Viewing on a mobile browser?</p>
                  <div className="pmf-actions">
                    <button
                      type="button"
                      className="rh-btn rh-btn-primary"
                      onClick={handleOpenTab}
                    >
                      Open Full PDF ↗
                    </button>
                    <button
                      type="button"
                      className="rh-btn rh-btn-ghost"
                      onClick={() => setActiveTab("clean")}
                    >
                      Switch to Clean View
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="resume-clean-view">
                {/* Clean View Document */}
                <article className="clean-doc">
                  {/* Top Intro — one contact line, exactly as the resume prints it */}
                  <header className="cd-head">
                    <h2>Vulavala Pushyanth Reddy</h2>
                    <div className="cd-contacts">
                      <a href="tel:+916363121593">+91-6363121593</a>
                      <a href="mailto:pushyanth2008@gmail.com">
                        pushyanth2008@gmail.com
                      </a>
                      <a
                        href="https://www.linkedin.com/in/pushyanth-reddy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin.com/in/pushyanth ↗
                      </a>
                      <a
                        href="https://github.com/Pushyanth02"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github.com/pushyanth ↗
                      </a>
                    </div>
                  </header>

                  {/* Professional Summary */}
                  <section className="cd-section">
                    <h4>PROFESSIONAL SUMMARY</h4>
                    <p className="cd-sum">
                      Computer Science undergraduate and Full-Stack Developer
                      with strong expertise in TypeScript, Next.js, React, and
                      modern browser APIs. Experienced in building local-first
                      web applications, client-side data parsing pipelines, and
                      deterministic state management engines. Grounded in
                      C/C++ memory management, linear data structures, and
                      relational database systems.
                    </p>
                  </section>

                  {/* Technical Skills */}
                  <section className="cd-section">
                    <h4>TECHNICAL SKILLS</h4>
                    <div className="cd-skills">
                      <div className="cd-row">
                        <b>Languages:</b> TypeScript, JavaScript, Python, C,
                        C++, HTML5, CSS3, SQL
                      </div>
                      <div className="cd-row">
                        <b>Frontend &amp; UI:</b> Next.js, React, Tailwind CSS,
                        Zustand, UI/UX Accessibility
                      </div>
                      <div className="cd-row">
                        <b>Backend &amp; Databases:</b> Node.js, PostgreSQL,
                        MySQL, SQLite, IndexedDB
                      </div>
                      <div className="cd-row">
                        <b>Developer Tools:</b> Git, GitHub, GitHub Actions
                        (CI/CD), Docker, Vercel, VS Code
                      </div>
                      <div className="cd-row">
                        <b>Soft Skills:</b> Problem Solving, Critical Thinking,
                        Creativity, Adaptability, Time Management
                      </div>
                    </div>
                  </section>

                  {/* Technical Projects */}
                  <section className="cd-section">
                    <h4>TECHNICAL PROJECTS</h4>

                    <div className="cd-item">
                      <div className="cd-item-head">
                        <h5>
                          <a
                            href="https://github.com/Pushyanth02/Lemniscate"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lemniscate ↗
                          </a>
                          <span className="cd-tech">
                            {" "}
                            | TypeScript · Next.js · IndexedDB · Zod · Web APIs
                          </span>
                          <a className="cd-git" href="https://lemniscate02.vercel.app/" target="_blank" rel="noopener noreferrer">Live ↗</a>
                        </h5>
                        <span className="cd-date">Apr 2024 – Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Built a local-first document processing application
                          supporting 7 file formats (PDF, EPUB, DOCX) using
                          pdf.js and JSZip for client-side parsing with zero
                          server data exposure.
                        </li>
                        <li>
                          Integrated an AI streaming interface using
                          Server-Sent Events (SSE) for real-time token
                          rendering, validated via runtime Zod schemas to
                          guarantee structured data integrity.
                        </li>
                        <li>
                          Implemented an on-device extractive text
                          summarization pipeline, integrating IndexedDB with
                          hash-based keying for persistent client-side
                          document caching.
                        </li>
                      </ul>
                    </div>

                    <div className="cd-item">
                      <div className="cd-item-head">
                        <h5>
                          <a
                            href="https://github.com/Pushyanth02/Dungeoncore-Necromancer"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Dungeoncore Necromancer ↗
                          </a>
                          <span className="cd-tech">
                            {" "}
                            | Next.js · React · TypeScript · Zustand
                          </span>
                          <a className="cd-git" href="https://pushyanth02.github.io/Dungeoncore-Necromancer/" target="_blank" rel="noopener noreferrer">Live ↗</a>
                        </h5>
                        <span className="cd-date">Jun 2026 – Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Developed a responsive web reading platform featuring
                          a unified command palette with client-side fuzzy
                          search for low-latency query matching.
                        </li>
                        <li>
                          Engineered a procedural audio synthesis engine using
                          the Web Audio API to generate real-time dynamic
                          soundscapes, eliminating external audio assets and
                          reducing payload size.
                        </li>
                        <li>
                          Deployed a static-exported web application adhering
                          to WCAG AA accessibility standards (keyboard focus
                          trapping, ARIA live regions) via GitHub Actions
                          CI/CD to GitHub Pages.
                        </li>
                      </ul>
                    </div>

                    <div className="cd-item">
                      <div className="cd-item-head">
                        <h5>
                          <a
                            href="https://github.com/Pushyanth02/Archmage"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Archmage ↗
                          </a>
                          <span className="cd-tech">
                            {" "}
                            | Next.js · TypeScript · Tailwind CSS
                          </span>
                          <a className="cd-git" href="https://pushyanth02.github.io/Archmage/" target="_blank" rel="noopener noreferrer">Live ↗</a>
                        </h5>
                        <span className="cd-date">Jan 2026 – Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Engineered a browser-based arcade roguelike
                          featuring 50 structured waves, 5 biomes, dynamically
                          shuffled tyrants, endless progression, and responsive
                          real-time gameplay systems.
                        </li>
                        <li>
                          Designed deterministic gameplay mechanics in
                          TypeScript, including seeded RNG, scaling difficulty
                          curves, multi-element spell resonances, weighted
                          reward cycling, and state-driven enemy/boss behavior.
                        </li>
                        <li>
                          Implemented persistent meta-progression,
                          accessibility controls, HUD systems, and synthesized
                          dynamic audio using Web Audio API, delivering a fully
                          client-side gameplay experience without accounts or
                          backend services.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Education */}
                  <section className="cd-section">
                    <h4>EDUCATION</h4>
                    <div className="cd-edu-grid">
                      <div className="cd-edu-card">
                        <div className="cd-item-head">
                          <h5>Lovely Professional University</h5>
                          <span className="cd-date">Aug 2025 – May 2029</span>
                        </div>
                        <p>
                          Bachelor of Technology in Computer Science and
                          Engineering
                        </p>
                        <span className="cd-score">CGPA: 7.98 · Phagwara, Punjab</span>
                      </div>

                      <div className="cd-edu-card">
                        <div className="cd-item-head">
                          <h5>Christ Academy Junior College</h5>
                          <span className="cd-date">May 2023 – Mar 2025</span>
                        </div>
                        <p>
                          Pre-University Course (PUC / 12th) — Science &amp;
                          Mathematics
                        </p>
                        <span className="cd-score">Percentage: 86.0% · Bangalore, Karnataka</span>
                      </div>
                    </div>
                  </section>

                  {/* Certifications & Technical Training */}
                  <section className="cd-section">
                    <h4>CERTIFICATIONS &amp; TECHNICAL TRAINING</h4>
                    <ul className="cd-cert-list">
                      <li>
                        <b>Computer Programming in C – iamneo Certification</b>{" "}
                        <span className="cd-date-tag">Jan 2026 – May 2026</span>
                      </li>
                      <li>
                        <b>Data Analytics Essentials – Cisco</b>{" "}
                        <span className="cd-date-tag">Feb 2026</span>
                      </li>
                      <li>
                        <b>Introduction to Cybersecurity – Infosys</b>{" "}
                        <span className="cd-date-tag">Mar 2026</span>
                      </li>
                    </ul>
                  </section>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
