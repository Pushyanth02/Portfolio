"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "./icons";
import { assetUrl } from "@/lib/utils";
import { toast } from "sonner";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<"pdf" | "clean">("pdf");

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

  const handleDownload = useCallback(() => {
    toast.success("Downloading Resume PDF...", {
      description: "Pushyanth_Reddy_Resume.pdf",
      duration: 2500,
    });
  }, []);

  if (!isOpen) return null;

  const pdfUrl = assetUrl("/Pushyanth_Reddy_Resume.pdf");

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
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rh-btn rh-btn-ghost"
                title="Open PDF in new browser tab"
              >
                Open ↗
              </a>
              <a
                href={pdfUrl}
                download="Pushyanth_Reddy_Resume.pdf"
                onClick={handleDownload}
                className="rh-btn rh-btn-primary"
                title="Download PDF"
              >
                Download PDF ⬇
              </a>
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
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  title="Vulavala Pushyanth Reddy Resume PDF"
                  className="pdf-viewer"
                />
                <div className="pdf-mobile-fallback">
                  <p>Viewing on a mobile browser?</p>
                  <div className="pmf-actions">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rh-btn rh-btn-primary"
                    >
                      Open Full PDF ↗
                    </a>
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
