"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, X, CheckCircle2 } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";

/**
 * ContactFormDialog — the "let's chat" message form (both universes).
 *
 * Fully client-side by design (the portfolio is a static export — no
 * server runtime): clicking "send a note"
 *
 *   1. validates the fields client-side (length caps + email shape)
 *   2. builds the prefilled Gmail compose URL for the owner's inbox
 *      locally (same format the former /api/contact route produced)
 *   3. opens it synchronously inside the click gesture (popup-blocker-
 *      safe) so the note is pre-addressed, pre-written — one click in
 *      Gmail delivers it
 *   4. if a popup was blocked anyway, an in-dialog success state with a
 *      manual "open draft" link keeps the flow working
 *
 * Skins: student = warm sticker card; dev = dark terminal card
 * (via `html.dev .cf-*` rules in dev.css).
 */

type Status = "idle" | "sending" | "done";

type Fields = { name: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** The inbox every prefilled Gmail draft targets. */
const OWNER_EMAIL = "pushyanth2008@gmail.com";

function validateClient(f: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.name.trim().length < 2 || f.name.trim().length > 80) {
    errors.name = "2–80 characters, please";
  }
  if (!EMAIL_RE.test(f.email.trim())) {
    errors.email = "that gmail doesn't look right";
  }
  if (f.message.trim().length < 10 || f.message.trim().length > 2000) {
    errors.message = "give me at least 10 characters (max 2000)";
  }
  return errors;
}

export function ContactFormDialog() {
  const open = usePortfolioStore((s) => s.contactOpen);
  const closeContact = usePortfolioStore((s) => s.closeContact);

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [composeUrl, setComposeUrl] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  const visible = open || closing;

  /* Reset the dialog after it fully closes. */
  useEffect(() => {
    if (open) {
      setClosing(false);
      return;
    }
    if (!closing) {
      setStatus("idle");
      setComposeUrl(null);
      setErrors({});
    }
  }, [open, closing]);

  /* Focus management: move focus into the dialog on open, restore on close. */
  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => {
      window.clearTimeout(t);
      prevActive?.focus?.();
    };
  }, [open]);

  /* Esc to dismiss (dialog role handles the rest via browsers' light
     behaviour; we implement it explicitly for reliability). */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status, closing]);

  if (!visible) return null;

  const requestClose = () => {
    if (status === "sending") return; // don't abandon an in-flight send
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      closeContact();
    }, 240);
  };

  const set = (key: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const clientErrors = validateClient(fields);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    /* Build the prefilled Gmail compose URL locally — the portfolio is
       a static export, so the delivery vehicle is the visitor's own
       Gmail: the draft is pre-addressed and pre-written; one click in
       Gmail sends it. (Identical URL format to the retired API route.) */
    const subject = `Portfolio message from ${fields.name.trim()}`;
    const body = [
      fields.message.trim(),
      "",
      "—",
      `${fields.name.trim()} (${fields.email.trim()})`,
      `sent from the portfolio contact form · ${new Date().toISOString()}`,
    ].join("\n");
    const compose = `https://mail.google.com/mail/?${new URLSearchParams({
      view: "cm",
      fs: "1",
      to: OWNER_EMAIL,
      su: subject,
      body,
    }).toString()}`;

    /* Open the compose window synchronously inside the user gesture so
       popup blockers allow it. */
    const composeWin = window.open(compose, "_blank", "noopener,noreferrer");

    if (composeWin) {
      setStatus("done");
      setFields(EMPTY);
      toast.success("Message on its way", {
        description: "A Gmail draft just opened — hit send and it lands in my inbox.",
        duration: 5000,
      });
      requestClose();
    } else {
      /* Popup was blocked — surface a manual link instead. */
      setStatus("done");
      setComposeUrl(compose);
      toast.info("Almost there", {
        description: "Pop-up blocked — open the Gmail draft from the dialog.",
        duration: 5000,
      });
    }
  };

  const done = status === "done" && composeUrl !== null;

  return (
    <div
      className={`cf-back${closing ? " cf-closing" : ""}`}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        ref={dialogRef}
        className={`cf-card${closing ? " cf-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
      >
        <div className="cf-head">
          <div className="cf-head-left">
            <span className="cf-badge" aria-hidden="true">
              <Send strokeWidth={1.9} />
            </span>
            <div>
              <h3 id={`${formId}-title`} className="cf-title">
                send a note
              </h3>
              <p className="cf-sub">straight to pushyanth&apos;s gmail</p>
            </div>
          </div>
          <button
            type="button"
            className="cf-close"
            onClick={requestClose}
            aria-label="Close contact form"
            disabled={status === "sending"}
          >
            <X strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {done ? (
          <div className="cf-success">
            <CheckCircle2 className="cf-success-ic" strokeWidth={1.8} aria-hidden="true" />
            <p className="cf-success-title">message saved ✓</p>
            <p className="cf-success-body">
              your note is stored — open the prefilled Gmail draft below and
              hit <b>send</b> to deliver it to the inbox.
            </p>
            <a
              className="cf-open-draft"
              href={composeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              open gmail draft <span aria-hidden="true">↗</span>
            </a>
            <button type="button" className="cf-ghost" onClick={requestClose}>
              done
            </button>
          </div>
        ) : (
          <form className="cf-form" onSubmit={onSubmit} noValidate>
            <div className="cf-field">
              <label htmlFor={`${formId}-name`}>your name</label>
              <input
                ref={firstFieldRef}
                id={`${formId}-name`}
                className={`cf-input${errors.name ? " cf-invalid" : ""}`}
                type="text"
                name="name"
                autoComplete="name"
                value={fields.name}
                onChange={set("name")}
                placeholder="ada lovelace"
                maxLength={80}
                data-allow-copy
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${formId}-name-err` : undefined}
              />
              {errors.name && (
                <p className="cf-error" id={`${formId}-name-err`} role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="cf-field">
              <label htmlFor={`${formId}-email`}>your gmail</label>
              <input
                id={`${formId}-email`}
                className={`cf-input${errors.email ? " cf-invalid" : ""}`}
                type="email"
                name="email"
                autoComplete="email"
                value={fields.email}
                onChange={set("email")}
                placeholder="you@gmail.com"
                maxLength={120}
                data-allow-copy
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${formId}-email-err` : undefined}
              />
              {errors.email && (
                <p className="cf-error" id={`${formId}-email-err`} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="cf-field">
              <label htmlFor={`${formId}-message`}>the message</label>
              <textarea
                id={`${formId}-message`}
                className={`cf-textarea${errors.message ? " cf-invalid" : ""}`}
                name="message"
                rows={5}
                value={fields.message}
                onChange={set("message")}
                placeholder="got a project, a problem, or a beautifully weird idea? spill it…"
                maxLength={2000}
                data-allow-copy
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${formId}-message-err` : undefined}
              />
              <div className="cf-field-foot">
                {errors.message ? (
                  <p className="cf-error" id={`${formId}-message-err`} role="alert">
                    {errors.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="cf-count">{fields.message.length}/2000</span>
              </div>
            </div>

            {/* honeypot — invisible to humans, catnip to bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="cf-honeypot"
              aria-hidden="true"
            />

            <button
              type="submit"
              className="cf-submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <>
                  <span className="cf-spinner" aria-hidden="true" /> sending…
                </>
              ) : (
                <>
                  send it <Send strokeWidth={1.9} aria-hidden="true" />
                </>
              )}
            </button>              <p className="cf-note">
              your note is validated locally, then a prefilled gmail draft
              opens — one click there and it&apos;s in the inbox.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
