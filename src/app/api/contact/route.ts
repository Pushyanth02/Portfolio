import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { db } from "@/lib/db";

/**
 * POST /api/contact — the "let's chat" message pipeline.
 *
 * Flow:
 *   1. zod-style validation (hand-rolled schema — field errors, length caps)
 *   2. honeypot check ("website" field must stay empty → bots auto-fill it)
 *   3. in-memory rate limit (5 submissions / 10 min / IP)
 *   4. durable storage in SQLite via Prisma (ContactMessage)
 *   5. response includes a prefilled Gmail compose URL so the visitor's
 *      note lands in the owner's Gmail inbox (no SMTP credentials needed —
 *      the draft is pre-addressed, pre-written; one click in Gmail sends it)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_EMAIL = "pushyanth2008@gmail.com";
const OWNER_NAME = "Pushyanth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  message: { min: 10, max: 2000 },
} as const;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(payload: Payload): FieldErrors {
  const errors: FieldErrors = {};
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    errors.name = `name: ${LIMITS.name.min}–${LIMITS.name.max} characters`;
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max) {
    errors.email = "a valid email address is required";
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    errors.message = `message: ${LIMITS.message.min}–${LIMITS.message.max} characters`;
  }
  return errors;
}

/* ---------- in-memory rate limiting (per-IP, sliding window) ---------- */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // opportunistic cleanup so the map never grows unbounded
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

function ipHash(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/** Prefilled Gmail compose URL — the actual delivery vehicle to the inbox. */
function gmailComposeUrl(name: string, email: string, message: string): string {
  const subject = `Portfolio message from ${name}`;
  const body = [
    message,
    "",
    "—",
    `${name} (${email})`,
    `sent from the portfolio contact form · ${new Date().toISOString()}`,
  ].join("\n");
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: OWNER_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot: real users never fill "website". Bots that do get a fake OK.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true, compose: null });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — try again in a few minutes." },
      { status: 429 }
    );
  }

  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fields: errors },
      { status: 400 }
    );
  }

  const name = (payload.name as string).trim();
  const email = (payload.email as string).trim();
  const message = (payload.message as string).trim();

  try {
    await db.contactMessage.create({
      data: { name, email, message, ipHash: ipHash(ip) },
    });
  } catch (err) {
    console.error("[contact] storage failed:", err);
    // Storage is best-effort — the Gmail handoff still works without it.
  }

  return NextResponse.json({
    ok: true,
    compose: gmailComposeUrl(name, email, message),
    owner: OWNER_NAME,
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
