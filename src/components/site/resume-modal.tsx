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
                  CS Student · Systems Builder · Bangalore, India
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
                  {/* Top Intro */}
                  <header className="cd-head">
                    <h2>Vulavala Pushyanth Reddy</h2>
                    <div className="cd-contacts">
                      <a
                        href="https://www.linkedin.com/in/pushyanth-reddy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn: Pushyanth | Linkedin ↗
                      </a>
                      <a href="mailto:pushyanth2008@gmail.com">
                        Email: pushyanth2008@gmail.com
                      </a>
                      <a
                        href="https://github.com/Pushyanth02"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub: github.com/Pushyanth ↗
                      </a>
                      <span>Mobile: +91-6363121593</span>
                    </div>
                  </header>

                  {/* Skills */}
                  <section className="cd-section">
                    <h4>SKILLS SUMMARY</h4>
                    <div className="cd-skills">
                      <div className="cd-row">
                        <b>Languages:</b> TypeScript, JavaScript, Python, C,
                        C++, HTML, CSS, SQL
                      </div>
                      <div className="cd-row">
                        <b>Libraries &amp; Frameworks:</b> Next.js, React,
                        Tailwind CSS
                      </div>
                      <div className="cd-row">
                        <b>Tools/Platforms:</b> Git, GitHub, GitHub Actions
                        (CI/CD), Docker, Vercel, VS Code
                      </div>
                      <div className="cd-row">
                        <b>Backend:</b> Node.js, PostgreSQL, MySQL
                      </div>
                      <div className="cd-row">
                        <b>Soft Skills:</b> Team Collaboration, Problem-Solving,
                        Adaptability, Communication, Critical thinking,
                        Leadership
                      </div>
                    </div>
                  </section>

                  {/* Projects */}
                  <section className="cd-section">
                    <h4>PROJECTS</h4>

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
                            | TypeScript · Next.js · IndexedDB · Zod
                          </span>
                          <a className="cd-git" href="https://github.com/Pushyanth02/Lemniscate" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                        </h5>
                        <span className="cd-date">Nov 2025 - Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Built a local-first document processing web
                          application supporting 7 file formats (including PDF,
                          EPUB, DOCX) utilizing pdf.js and JSZip for fully
                          client-side parsing with zero server data exposure.
                        </li>
                        <li>
                          Integrated a modular AI streaming interface using
                          Server-Sent Events (SSE) for real-time token rendering,
                          validated by runtime Zod schemas for structured
                          output integrity.
                        </li>
                        <li>
                          Implemented an on-device extractive text
                          summarization pipeline, integrating IndexedDB with
                          SHA/hash-based keying for local document caching.
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
                          <a className="cd-git" href="https://github.com/Pushyanth02/Dungeoncore-Necromancer" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                        </h5>
                        <span className="cd-date">June 2026 – Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Developed a dynamic web reading platform featuring a
                          unified command palette (⌘K) with fuzzy search for
                          low-latency client-side indexing and query matching.
                        </li>
                        <li>
                          Designed a procedural audio synthesizer utilizing the
                          Web Audio API to generate dynamic audio in real time,
                          eliminating external media assets and optimizing
                          initial bundle payload.
                        </li>
                        <li>
                          Deployed a fully static-exported, zero-server web
                          application adhering to WCAG AA accessibility
                          standards (keyboard focus trapping, ARIA live regions)
                          via GitHub Actions CI/CD.
                        </li>
                      </ul>
                    </div>

                    <div className="cd-item">
                      <div className="cd-item-head">
                        <h5>
                          <a
                            href="https://github.com/Pushyanth02/LuckOMatic-9000"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Luck-O-Matic 9000 ↗
                          </a>
                          <span className="cd-tech">
                            {" "}
                            | TypeScript · Next.js · Tailwind · Web Audio API
                          </span>
                          <a className="cd-git" href="https://github.com/Pushyanth02/LuckOMatic-9000" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                        </h5>
                        <span className="cd-date">Jan 2026 - Aug 2026</span>
                      </div>
                      <ul>
                        <li>
                          Engineered an interactive web application featuring
                          dynamic state-driven progression, multi-tier inventory
                          structures, and responsive UI components built with
                          Tailwind CSS.
                        </li>
                        <li>
                          Built a deterministic state-management engine in
                          TypeScript using immutable reducers and time-delta
                          calculation to process asynchronous background
                          calculations.
                        </li>
                        <li>
                          Implemented client-side data persistence utilizing
                          Local Storage APIs, ensuring continuous state
                          synchronization and data integrity across browser
                          reloads.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Training */}
                  <section className="cd-section">
                    <h4>TRAINING</h4>
                    <div className="cd-item">
                      <div className="cd-item-head">
                        <h5>
                          Computer Programming in C - iamneo{" "}
                          <a className="cd-git" href="https://github.com/Pushyanth02" target="_blank" rel="noopener noreferrer">Certificate ↗</a>
                        </h5>
                        <span className="cd-date">Jan 2026 - May 2026</span>
                      </div>
                      <ul>
                        <li>
                          Completed rigorous coursework in C covering
                          foundational syntax, control flow, POSIX standard
                          libraries, and structural programming patterns.
                        </li>
                        <li>
                          Implemented low-level memory management solutions
                          using explicit pointer arithmetic, dynamic heap
                          allocation (malloc/calloc/free), and structured data
                          layouts.
                        </li>
                        <li>
                          Engineered linear data structures (linked lists,
                          dynamic arrays) and algorithmic routines focused on
                          pointer manipulation and time/space complexity
                          optimization.
                        </li>
                      </ul>
                    </div>
                  </section>

                  {/* Certificates */}
                  <section className="cd-section">
                    <h4>CERTIFICATES</h4>
                    <ul className="cd-cert-list">
                      <li>
                        <b>Data Analytics Essentials by Cisco</b> | <a className="cd-git" href="https://github.com/Pushyanth02" target="_blank" rel="noopener noreferrer">Certificate ↗</a>{" "}
                        <span className="cd-date-tag">Feb 2026</span>
                      </li>
                      <li>
                        <b>Introduction to Cybersecurity by Infosys</b> | <a className="cd-git" href="https://github.com/Pushyanth02" target="_blank" rel="noopener noreferrer">Certificate ↗</a>{" "}
                        <span className="cd-date-tag">Mar 2026</span>
                      </li>
                      <li>
                        <b>
                          Master Your Leadership Effectiveness Skills by
                          LinkedIn
                        </b>{" "}
                        | <a className="cd-git" href="https://github.com/Pushyanth02" target="_blank" rel="noopener noreferrer">Certificate ↗</a>{" "}
                        <span className="cd-date-tag">Nov 2025</span>
                      </li>
                    </ul>
                  </section>

                  {/* Education */}
                  <section className="cd-section">
                    <h4>EDUCATION</h4>
                    <div className="cd-edu-grid">
                      <div className="cd-edu-card">
                        <div className="cd-item-head">
                          <h5>Lovely Professional University</h5>
                          <span className="cd-date">Aug 2025 - May 2029</span>
                        </div>
                        <p>
                          Bachelor of Technology - Computer Science and
                          Engineering
                        </p>
                        <span className="cd-score">CGPA: 7.98</span>
                      </div>

                      <div className="cd-edu-card">
                        <div className="cd-item-head">
                          <h5>Christ Academy Junior College</h5>
                          <span className="cd-date">May 2023 – Mar 2025</span>
                        </div>
                        <p>Pre-University Course (PUC/12th)</p>
                        <span className="cd-score">Percentage: 86%</span>
                      </div>

                      <div className="cd-edu-card">
                        <div className="cd-item-head">
                          <h5>New Horizon High School</h5>
                          <span className="cd-date">May 2022 – Mar 2023</span>
                        </div>
                        <p>Secondary School (10th)</p>
                        <span className="cd-score">Percentage: 92%</span>
                      </div>
                    </div>
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
