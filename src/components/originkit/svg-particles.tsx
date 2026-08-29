// Originkit "SVG Particles" — reworked port: local path/text source, pause-aware loop, adaptive budget, reduced-motion static frame.
"use client";

import { useEffect, useRef, type JSX, type PointerEvent as ReactPointerEvent } from "react";

/**
 * SVG PARTICLES — a glyph that exists only as a drifting dust field until a
 * pointer arrives, condenses into its shape, then shatters back to roaming
 * when the pointer leaves.
 *
 * Ported from Originkit's "SVG Particles" (a canvas image→particle system).
 * The physics is the source's, term for term: the idle → assembling → active
 * → scattering state machine; roam drift toward per-particle targets inside
 * the container (retarget within 3px, velocity carrying 0.98 and clamped to
 * 1.5px/frame); the eased assemble/scatter tween and the roam-opacity fade
 * (both on the source preset's easeInOut); and the repulsion — a zone centred
 * on a lerped, speed-aware pointer position, impelled by the raw pointer
 * speed (decayed 0.88/frame) with falloff by distance, relaxing back at
 * 0.97/frame. Particles are written as raw pixels into an ImageData buffer
 * and pushed with putImageData, exactly as the source renders.
 *
 * Reworked for this site (the deltas, not the physics):
 *
 * — SOURCE, NOT IMAGE: no URL, no network, no CORS retry. The offscreen
 *   sampling canvas is drawn locally — an SVG path stretched over the full
 *   sampling rect (the site's ∞ glyph in a 24×24 viewBox, filled AND stroked
 *   at 2.2 units so it reads as a solid band rather than a thin line), or a
 *   serif text glyph — then sampled exactly as the source sampled image
 *   pixels (alpha ≥ 20 on a gap grid, then shuffled).
 *
 * — ADAPTIVE BUDGET: effective count = min(count, area/220), recomputed on
 *   resize. The source's gap formula (max(2, round(150/count))) adapts to
 *   it, and the shuffled sample is trimmed to it — small containers never
 *   run thousands of particles.
 *
 * — PAUSE-AWARE LOOP: rAF stops when the tab is hidden or the container is
 *   out of viewport (IntersectionObserver, threshold 0), and resumes without
 *   a hitch: time runs on a clock that only advances in live frames (dt
 *   clamped at 50ms), and the source's setTimeout state flips are instead
 *   derived from that clock, so mid-flight transitions survive a pause.
 *   Resize re-inits are debounced 150ms so mobile address-bar resizes don't
 *   thrash.
 *
 * — TOUCH: pointer events (move / down / up / cancel / leave). touch-action
 *   is deliberately untouched — page scroll always wins; a tap assembles,
 *   lifting the finger scatters.
 *
 * — A11Y / REDUCED MOTION: the canvas is role="img" with an aria-label;
 *   under prefers-reduced-motion it renders one static assembled frame (no
 *   loop, no repulsion) and re-renders it on resize.
 *
 * Two deliberate deviations from the source, both for this site's contract:
 * `size` is literal CSS pixels (the source's size/4 dial would render the
 * default 4 as a 1px speck), and with `roam` off the scattered cloud rests
 * visible at roam opacity (the source's hide mode fades to nothing, which
 * would leave a blank box in a page that is never hovered).
 */

// ── Tunables ────────────────────────────────────────────────────────────────

/** The site's infinity glyph, authored in a 24×24 viewBox. */
const DEFAULT_PATH =
    "M18.2 8c5 0 5 8 0 8-3.8 0-4.9-3.4-6.2-5-1.3-1.6-2.4-5-6.2-5-5 0-5 8 0 8 3.8 0 4.9-3.4 6.2-5 1.3-1.6 2.4-5 6.2-5z";
const DEFAULT_COLORS = ["#E8603C", "#F2B33D", "#3E7C4F", "#201A14"];
/** Source viewBox the path data is authored against. */
const VIEWBOX = 24;
/** Stroke width in viewBox units — fattens the glyph into a solid band. */
const STROKE_WIDTH = 2.2;
/** Opacity of the scattered/roaming cloud (source preset's roamOpacity). */
const ROAM_OPACITY = 0.5;
/** Minimum source-pixel alpha to spawn a particle (source threshold). */
const ALPHA_MIN = 20;
/** Container px² allotted per particle when clamping the budget. */
const AREA_PER_PARTICLE = 220;
/** Numerator of the source's sampling-gap formula. */
const GAP_DENSITY = 150;
/** Device pixel ratio ceiling — putImageData cost scales with dpr². */
const MAX_DPR = 2;
/** Resize → re-init debounce, so mobile address-bar resizes don't thrash. */
const RESIZE_DEBOUNCE_MS = 150;
/** Per-frame clock advance ceiling — long frames never spike the clock. */
const FRAME_DT_CLAMP = 50;

export type SvgParticlesProps = {
    /** SVG path data drawn as the particle source (24×24 viewBox). */
    path?: string;
    /** Optional text glyph source instead of a path. */
    text?: string;
    /** Particle palette (cycled per-particle). */
    colors?: string[];
    /** Target particle budget. */
    count?: number;
    /** Particle size in CSS px. */
    size?: number;
    /** Particle shape. */
    shape?: "circle" | "square";
    /** Idle roaming drift when pointer is away. */
    roam?: boolean;
    /** Pointer repulsion. */
    repel?: boolean;
    /** Repulsion radius in CSS px. */
    repelRadius?: number;
    /** Repulsion force. */
    repelForce?: number;
    /** Assemble/scatter transition duration ms. */
    duration?: number;
    className?: string;
    /** Accessible label (canvas gets role="img"). */
    ariaLabel?: string;
};

// ── Types ───────────────────────────────────────────────────────────────────

type RGB = { r: number; g: number; b: number };

/** The source's four animation states. */
type AnimState = "idle" | "assembling" | "active" | "scattering";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    startX: number;
    startY: number;
    repX: number;
    repY: number;
    homeX: number;
    homeY: number;
    idleX: number;
    idleY: number;
    roamTargetX: number;
    roamTargetY: number;
    r: number;
    g: number;
    b: number;
    a: number;
    inZone: boolean;
};

// ── Helpers (ported from the source) ────────────────────────────────────────

/** Parse #rrggbb / #rrggbbaa / rgb()/rgba() into channel bytes. */
function parseColor(c: string): RGB {
    const m = c.match(
        /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/,
    );
    if (m) return { r: +m[1] | 0, g: +m[2] | 0, b: +m[3] | 0 };
    const h = c.replace("#", "");
    if (h.length >= 6) {
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    }
    return { r: 200, g: 200, b: 200 };
}

/** Fisher–Yates, in place. */
function shuffle<T>(a: T[]): void {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}

/** Random point inside a rectangle (the source's default roam shape). */
function randomInRect(bx: number, by: number, bw: number, bh: number): [number, number] {
    return [bx + Math.random() * bw, by + Math.random() * bh];
}

/** The source preset's easeInOut. */
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

/**
 * Scatter resting position for roam-off mode: a random point ~half the
 * container's max dimension away from home (the source's "scatter" hide
 * range, range 10 of 10).
 */
function scatterPos(homeX: number, homeY: number, W: number, H: number): [number, number] {
    const d = 0.5 * Math.max(W, H);
    const angle = Math.random() * Math.PI * 2;
    return [homeX + Math.cos(angle) * d, homeY + Math.sin(angle) * d];
}

/** The source's particle factory (dead fields dropped). */
function mkParticle(
    homeX: number,
    homeY: number,
    x: number,
    y: number,
    idleX: number,
    idleY: number,
    col: RGB,
): Particle {
    return {
        x,
        y,
        vx: 0,
        vy: 0,
        startX: x,
        startY: y,
        repX: 0,
        repY: 0,
        homeX,
        homeY,
        idleX,
        idleY,
        roamTargetX: 0,
        roamTargetY: 0,
        r: col.r,
        g: col.g,
        b: col.b,
        a: 255,
        inZone: false,
    };
}

/**
 * Paint the particle SOURCE into an offscreen context — this replaces the
 * source component's image loading (and its CORS retry dance) with a local
 * draw. White on transparent; the sampling pass reads alpha only.
 *
 * Path mode stretches the 24×24 viewBox over the whole rect (the source's
 * fill-mode semantics) and strokes as well as fills, so a band glyph reads
 * at particle density. Text mode centres one heavy serif glyph.
 */
function drawGlyph(
    oc: CanvasRenderingContext2D,
    W: number,
    H: number,
    path: string,
    text: string | undefined,
): void {
    oc.save();
    oc.fillStyle = "#ffffff";
    oc.strokeStyle = "#ffffff";
    if (text) {
        oc.font = `900 ${Math.round(H * 0.72)}px Georgia, 'Times New Roman', serif`;
        oc.textAlign = "center";
        oc.textBaseline = "middle";
        oc.fillText(text, W / 2, H / 2);
    } else {
        let p: Path2D;
        try {
            p = new Path2D(path);
        } catch {
            p = new Path2D(DEFAULT_PATH);
        }
        oc.setTransform(W / VIEWBOX, 0, 0, H / VIEWBOX, 0, 0);
        oc.lineWidth = STROKE_WIDTH;
        oc.lineJoin = "round";
        oc.lineCap = "round";
        oc.fill(p);
        oc.stroke(p);
    }
    oc.restore();
}

/**
 * Shape-aware pixel writer, ported verbatim: a ps×ps box (circle inscribed
 * when round) written straight into the ImageData buffer. Coordinates are
 * device pixels — callers multiply CSS-space positions by dpr first.
 */
function blitParticle(
    buf: Uint8ClampedArray,
    PW: number,
    PH: number,
    ps: number,
    cx: number,
    cy: number,
    r: number,
    g: number,
    b: number,
    a: number,
    isCircle: boolean,
): void {
    const half = ps / 2;
    const px0 = Math.round(cx) - (ps >> 1);
    const py0 = Math.round(cy) - (ps >> 1);
    for (let dy = 0; dy < ps; dy++) {
        const iy = py0 + dy;
        if (iy < 0 || iy >= PH) continue;
        const row = iy * PW;
        for (let dx = 0; dx < ps; dx++) {
            if (isCircle) {
                const ddx = dx - half + 0.5;
                const ddy = dy - half + 0.5;
                if (ddx * ddx + ddy * ddy > half * half) continue;
            }
            const ix = px0 + dx;
            if (ix < 0 || ix >= PW) continue;
            const i = (row + ix) * 4;
            buf[i] = r;
            buf[i + 1] = g;
            buf[i + 2] = b;
            buf[i + 3] = a;
        }
    }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function SvgParticles(props: SvgParticlesProps): JSX.Element {
    const {
        path = DEFAULT_PATH,
        text,
        colors,
        count = 900,
        size = 4,
        shape = "circle",
        roam = true,
        repel = true,
        repelRadius = 90,
        repelForce = 8,
        duration = 900,
        className,
        ariaLabel = "Particle field",
    } = props;
    const palette = colors !== undefined && colors.length > 0 ? colors : DEFAULT_COLORS;

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<{ init: () => void } | null>(null);

    const dimsRef = useRef({ W: 0, H: 0 });
    const sceneRef = useRef<{ particles: Particle[] }>({ particles: [] });
    const animStateRef = useRef<AnimState>("idle");
    const animStartRef = useRef(0);
    const roamFadeStartRef = useRef(0);
    const roamFadeFromRef = useRef(1);
    const roamFadeToRef = useRef(ROAM_OPACITY);
    /** Paused clock — only advances inside live animation frames. */
    const clockRef = useRef(0);
    const mouseRef = useRef({ x: -99999, y: -99999, active: false });
    const prevMouseRef = useRef({ x: -99999, y: -99999 });
    const mouseSpeedRef = useRef(0);
    /** Smoothed pointer position for the repulsion zone. */
    const smoothMouseRef = useRef({ x: -99999, y: -99999 });
    const reducedRef = useRef(false);

    /** Live physics params (the source's physicsRef pattern — no re-init). */
    const paramsRef = useRef({
        size,
        shape,
        roam,
        repel,
        repelRadius,
        repelForce,
        duration: Math.max(1, duration),
        palette,
    });
    /** Source-shape config (the source's samplingRef pattern — re-inits). */
    const sourceRef = useRef({ path, text, count, roam });

    useEffect(() => {
        paramsRef.current = {
            size,
            shape,
            roam,
            repel,
            repelRadius,
            repelForce,
            duration: Math.max(1, duration),
            palette,
        };
        sourceRef.current = { path, text, count, roam };
    });

    // ── Transition starter (ported; state flips moved onto the paused clock) ──
    const startAnim = (newState: AnimState) => {
        const particles = sceneRef.current.particles;
        const { W, H } = dimsRef.current;
        const { roam: roamOn } = paramsRef.current;
        const durMs = paramsRef.current.duration;
        const bw = Math.max(80, W);
        const bh = Math.max(80, H);
        const bx = (W - bw) / 2;
        const by = (H - bh) / 2;
        for (const p of particles) {
            p.startX = p.x;
            p.startY = p.y;
            if (newState === "scattering" && roamOn) {
                const [tx, ty] = randomInRect(bx, by, bw, bh);
                p.roamTargetX = tx;
                p.roamTargetY = ty;
                p.idleX = tx;
                p.idleY = ty;
            }
        }
        // Opacity fades between assembled (1) and roaming (0.5).
        if (newState === "scattering") {
            roamFadeStartRef.current = clockRef.current;
            roamFadeFromRef.current = 1;
            roamFadeToRef.current = ROAM_OPACITY;
        } else if (newState === "assembling") {
            roamFadeStartRef.current = clockRef.current;
            roamFadeFromRef.current = ROAM_OPACITY;
            roamFadeToRef.current = 1;
        }
        // Roam mode skips the scatter tween entirely — the cloud deforms
        // straight into drifting.
        if (newState === "scattering" && roamOn) {
            animStateRef.current = "idle";
            return;
        }
        animStartRef.current = clockRef.current;
        animStateRef.current = newState;
    };

    // ── Pointer tracking (the source's mousemove, on pointer events) ─────────
    const updatePointer = (e: ReactPointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        // Normalise screen CSS px → intrinsic particle space; the rect may be
        // CSS-scaled relative to the bitmap, and without this the repulsion
        // radius would shrink with it.
        const { W, H } = dimsRef.current;
        const scaleX = rect.width > 0 ? W / rect.width : 1;
        const scaleY = rect.height > 0 ? H / rect.height : 1;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const prev = prevMouseRef.current;
        if (prev.x > -9999) {
            const ddx = mx - prev.x;
            const ddy = my - prev.y;
            mouseSpeedRef.current = Math.sqrt(ddx * ddx + ddy * ddy);
        }
        prevMouseRef.current = { x: mx, y: my };
        mouseRef.current = { x: mx, y: my, active: true };
        const s = animStateRef.current;
        if (s === "idle" || s === "scattering") startAnim("assembling");
    };

    const endPointer = () => {
        mouseRef.current = { x: -99999, y: -99999, active: false };
        const s = animStateRef.current;
        if (s === "assembling" || s === "active") startAnim("scattering");
    };

    // ── Engine: canvas, render loop, observers ───────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        let lastT = 0;
        let inView = false;
        let primed = false;
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        let idata: ImageData | null = null;
        let bufW = 0;
        let bufH = 0;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedRef.current = mq.matches;

        const ensureBuffer = (PW: number, PH: number): ImageData => {
            if (!idata || PW !== bufW || PH !== bufH) {
                idata = ctx.createImageData(PW, PH);
                bufW = PW;
                bufH = PH;
            }
            idata.data.fill(0);
            return idata;
        };

        /** One static frame, particles assembled at home — reduced motion. */
        const paintStatic = () => {
            const PW = canvas.width;
            const PH = canvas.height;
            if (!PW || !PH) return;
            const particles = sceneRef.current.particles;
            if (!particles.length) return;
            const { W } = dimsRef.current;
            const dpr = W > 0 ? PW / W : 1;
            const { size: pSz, shape: pShape } = paramsRef.current;
            const ps = Math.max(1, Math.round(pSz * dpr));
            const img = ensureBuffer(PW, PH);
            const isCircle = pShape === "circle";
            for (const p of particles) {
                blitParticle(
                    img.data,
                    PW,
                    PH,
                    ps,
                    p.homeX * dpr,
                    p.homeY * dpr,
                    p.r,
                    p.g,
                    p.b,
                    p.a,
                    isCircle,
                );
            }
            ctx.putImageData(img, 0, 0);
        };

        /** The source's render loop, on the paused clock. */
        const paint = () => {
            const PW = canvas.width;
            const PH = canvas.height;
            if (!PW || !PH) return;
            const particles = sceneRef.current.particles;
            if (!particles.length) return;
            const { W: DW, H: DH } = dimsRef.current;
            const dpr = DW > 0 ? PW / DW : 1;
            const img = ensureBuffer(PW, PH);
            const buf = img.data;
            const {
                size: pSz,
                shape: pShape,
                roam: roamOn,
                repel: repOn,
                repelRadius: rR,
                repelForce: rF,
                duration: durMs,
            } = paramsRef.current;

            // The source ends assembling/scattering with a wall-clock
            // setTimeout, which would fire while this loop is paused (tab
            // hidden / off-screen). Flipping the state here, on the paused
            // clock, keeps tween and state in lockstep across pauses.
            let state = animStateRef.current;
            if (
                (state === "assembling" || state === "scattering") &&
                clockRef.current - animStartRef.current >= durMs
            ) {
                state = state === "assembling" ? "active" : "idle";
                animStateRef.current = state;
            }

            const { x: rawMx, y: rawMy, active } = mouseRef.current;
            // Capture raw speed BEFORE the 0.88 decay — the impulse must use
            // the live value, not last frame's faded one.
            const hitSpeed = mouseSpeedRef.current;
            mouseSpeedRef.current *= 0.88;

            // Smooth the repulsion-zone centre. lerpFactor rides a gentle
            // curve — still 0.30, speed 30 → 0.12, floored at 0.08 — so the
            // zone follows the pointer as one continuous flowing shape
            // instead of stamping discrete ghost rings behind it.
            const sm = smoothMouseRef.current;
            if (repOn && active) {
                const lerpFactor = Math.max(0.08, 0.3 - hitSpeed * 0.006);
                if (sm.x < -9000) {
                    sm.x = rawMx;
                    sm.y = rawMy;
                } else {
                    sm.x += (rawMx - sm.x) * lerpFactor;
                    sm.y += (rawMy - sm.y) * lerpFactor;
                }
            } else {
                sm.x = -99999;
                sm.y = -99999;
            }
            const mx = sm.x;
            const my = sm.y;

            const ps = Math.max(1, Math.round(pSz * dpr));
            const animT = easeInOut(
                Math.min(1, (clockRef.current - animStartRef.current) / durMs),
            );

            // Roam box: the full container, min 80px (source defaults).
            const bw = Math.max(80, DW);
            const bh = Math.max(80, DH);
            const bx = (DW - bw) / 2;
            const by = (DH - bh) / 2;

            const repCutoff = Math.max(1, rR);
            const repCutoffSq = repCutoff * repCutoff;

            // Roam-opacity fade between 1 (assembled) and 0.5 (scattered),
            // eased on the paused clock.
            let alphaMul = ROAM_OPACITY;
            if (roamFadeStartRef.current !== 0) {
                const fadeT = Math.min(
                    1,
                    Math.max(0, (clockRef.current - roamFadeStartRef.current) / durMs),
                );
                alphaMul =
                    roamFadeFromRef.current +
                    (roamFadeToRef.current - roamFadeFromRef.current) * easeInOut(fadeT);
            }

            const isCircle = pShape === "circle";

            for (const p of particles) {
                // ── Resolve base position from the animation state ──────────
                let baseX = p.x;
                let baseY = p.y;
                if (state === "assembling") {
                    baseX = p.startX + (p.homeX - p.startX) * animT;
                    baseY = p.startY + (p.homeY - p.startY) * animT;
                } else if (state === "scattering") {
                    baseX = p.startX + (p.idleX - p.startX) * animT;
                    baseY = p.startY + (p.idleY - p.startY) * animT;
                } else if (state === "active") {
                    baseX = p.homeX;
                    baseY = p.homeY;
                } else if (roamOn) {
                    // Idle roaming: drift toward the target, retarget within
                    // 3px; velocity keeps 98% of itself plus 0.3% of the
                    // remaining distance, clamped to 1.5px/frame.
                    const dtx = p.roamTargetX - p.x;
                    const dty = p.roamTargetY - p.y;
                    if (Math.sqrt(dtx * dtx + dty * dty) < 3) {
                        const [tx, ty] = randomInRect(bx, by, bw, bh);
                        p.roamTargetX = tx;
                        p.roamTargetY = ty;
                    }
                    p.vx = p.vx * 0.98 + (p.roamTargetX - p.x) * 0.003;
                    p.vy = p.vy * 0.98 + (p.roamTargetY - p.y) * 0.003;
                    const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (sp > 1.5) {
                        p.vx = (p.vx / sp) * 1.5;
                        p.vy = (p.vy / sp) * 1.5;
                    }
                    p.x += p.vx;
                    p.y += p.vy;
                    baseX = p.x;
                    baseY = p.y;
                } else {
                    // Roam off: rest at the scatter position, no drift.
                    baseX = p.idleX;
                    baseY = p.idleY;
                }

                // ── Repulsion (the source's "outside" mode) ─────────────────
                if (repOn && active) {
                    const dx = baseX - mx;
                    const dy = baseY - my;
                    const distSq = dx * dx + dy * dy;
                    if (distSq > 0 && distSq < repCutoffSq) {
                        const dist = Math.sqrt(distSq);
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const falloff = 1 - dist / repCutoff;
                        const push = falloff * hitSpeed * rF * 0.05;
                        p.repX += nx * push;
                        p.repY += ny * push;
                        // Ease toward the zone's edge while the speed impulse
                        // lands, so a slow pointer still parts the field.
                        p.repX += (nx * (repCutoff - dist) - p.repX) * 0.06;
                        p.repY += (ny * (repCutoff - dist) - p.repY) * 0.06;
                        p.inZone = true;
                    } else {
                        p.inZone = false;
                    }
                } else {
                    p.inZone = false;
                }
                // Outside the zone (or repulsion off): relax back home.
                if (!p.inZone) {
                    p.repX *= 0.97;
                    p.repY *= 0.97;
                }
                p.x = baseX + p.repX;
                p.y = baseY + p.repY;

                // ── Alpha: full when assembled, faded while scattered ───────
                const alpha = state === "active" ? p.a : Math.round(p.a * alphaMul);
                if (alpha < 1) continue;
                blitParticle(buf, PW, PH, ps, p.x * dpr, p.y * dpr, p.r, p.g, p.b, alpha, isCircle);
            }
            ctx.putImageData(img, 0, 0);
        };

        const frame = (now: number) => {
            raf = 0;
            if (document.hidden || !inView || reducedRef.current) return;
            // Paused clock: dt only advances while frames actually run, and
            // is clamped so a long frame never spikes it.
            const dt = Math.min(now - lastT, FRAME_DT_CLAMP);
            lastT = now;
            clockRef.current += dt;
            paint();
            raf = requestAnimationFrame(frame);
        };

        const kick = () => {
            if (raf || reducedRef.current || document.hidden || !inView) return;
            lastT = performance.now();
            raf = requestAnimationFrame(frame);
        };

        // ── Build the scene from the locally drawn source glyph ──────────────
        const init = () => {
            const { W, H } = dimsRef.current;
            if (!W || !H) return;
            const { path: pathSrc, text: textSrc, count: wanted, roam: roamOn } = sourceRef.current;
            const paletteRgb = paramsRef.current.palette.map(parseColor);

            // Adaptive budget: cap the requested count by container area, then
            // derive the sampling gap from it (source formula).
            const budget = Math.max(1, Math.min(wanted, Math.floor((W * H) / AREA_PER_PARTICLE)));
            const gap = Math.max(2, Math.round(GAP_DENSITY / Math.max(1, budget)));

            const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);

            // Reset the pointer — a re-init mid-hover waits for the next
            // pointermove before repelling again (source behaviour).
            mouseRef.current = { x: -99999, y: -99999, active: false };
            prevMouseRef.current = { x: -99999, y: -99999 };
            mouseSpeedRef.current = 0;
            smoothMouseRef.current = { x: -99999, y: -99999 };

            const off = document.createElement("canvas");
            off.width = W;
            off.height = H;
            const oc = off.getContext("2d");
            if (!oc) return;
            drawGlyph(oc, W, H, pathSrc, textSrc);
            let px: Uint8ClampedArray | null = null;
            try {
                px = oc.getImageData(0, 0, W, H).data;
            } catch {
                px = null;
            }
            if (!px) return;

            // Sample the drawn glyph exactly as the source sampled image
            // pixels: a gap grid over the buffer, alpha ≥ 20.
            const src: Array<{ x: number; y: number }> = [];
            for (let y = 0; y < H; y += gap) {
                for (let x = 0; x < W; x += gap) {
                    const i = (y * W + x) * 4;
                    if (px[i + 3] >= ALPHA_MIN) src.push({ x, y });
                }
            }
            // Shuffle, then trim to the budget: a uniformly random subset of
            // the glyph's pixels, so coverage stays even at any density.
            shuffle(src);
            if (src.length > budget) src.length = budget;

            const bw = Math.max(80, W);
            const bh = Math.max(80, H);
            const bx = (W - bw) / 2;
            const by = (H - bh) / 2;

            const particles = src.map((s) => {
                // Colour cycled per particle off a random 0–9 index, exactly
                // the source's multi-colour mode.
                const col = paletteRgb[Math.floor(Math.random() * 10) % paletteRgb.length];
                if (roamOn) {
                    // Born scattered across the roam box, already drifting.
                    const [rx, ry] = randomInRect(bx, by, bw, bh);
                    const p = mkParticle(s.x, s.y, rx, ry, rx, ry, col);
                    const [tx, ty] = randomInRect(bx, by, bw, bh);
                    p.roamTargetX = tx;
                    p.roamTargetY = ty;
                    p.vx = (Math.random() - 0.5) * 1.2;
                    p.vy = (Math.random() - 0.5) * 1.2;
                    return p;
                }
                // Roam off: born at the scatter resting positions.
                const [sx, sy] = scatterPos(s.x, s.y, W, H);
                return mkParticle(s.x, s.y, sx, sy, sx, sy, col);
            });
            sceneRef.current = { particles };
            animStateRef.current = "idle";
            // Fresh cloud reads at roam opacity (the source leaked a stale
            // fade target across re-inits; resetting is the fix).
            roamFadeStartRef.current = 0;
            roamFadeFromRef.current = 1;
            roamFadeToRef.current = ROAM_OPACITY;

            if (reducedRef.current) {
                paintStatic();
            } else {
                kick();
            }
        };

        engineRef.current = { init };

        // Pause when the tab is hidden — cancel the pending frame outright.
        const onVisibility = () => {
            if (document.hidden) {
                if (raf) cancelAnimationFrame(raf);
                raf = 0;
            } else {
                kick();
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        // Pause when the container leaves the viewport; resume on return.
        const io = new IntersectionObserver(
            (entries) => {
                inView = entries[0]?.isIntersecting ?? inView;
                if (inView) kick();
            },
            { threshold: 0 },
        );
        io.observe(container);

        // Resize → re-init (source pattern), debounced; the first sizing
        // applies immediately so first paint isn't delayed. dims are updated
        // together with the re-init so the bitmap and particle space never
        // disagree mid-debounce.
        const ro = new ResizeObserver((entries) => {
            const r = entries[0]?.contentRect;
            if (!r) return;
            const W = Math.round(r.width);
            const H = Math.round(r.height);
            if (!W || !H) return;
            const apply = () => {
                dimsRef.current = { W, H };
                init();
            };
            if (!primed) {
                primed = true;
                apply();
                return;
            }
            if (resizeTimer !== null) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(apply, RESIZE_DEBOUNCE_MS);
        });
        ro.observe(container);

        // Reduced-motion is a live toggle: entering it parks the loop on one
        // static assembled frame; leaving it resumes the simulation.
        const onMotionChange = () => {
            reducedRef.current = mq.matches;
            if (mq.matches) {
                if (raf) cancelAnimationFrame(raf);
                raf = 0;
                paintStatic();
            } else {
                kick();
            }
        };
        mq.addEventListener("change", onMotionChange);

        return () => {
            engineRef.current = null;
            if (raf) cancelAnimationFrame(raf);
            if (resizeTimer !== null) clearTimeout(resizeTimer);
            document.removeEventListener("visibilitychange", onVisibility);
            mq.removeEventListener("change", onMotionChange);
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    // Rebuild the scene when the source shape or budget changes. Live physics
    // props (size, shape, repel…) are read from paramsRef each frame instead.
    const paletteKey = palette.join("|");
    useEffect(() => {
        engineRef.current?.init();
    }, [path, text, paletteKey, count, roam]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
        >
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={ariaLabel}
                style={{ display: "block", width: "100%", height: "100%" }}
                onPointerMove={updatePointer}
                onPointerDown={updatePointer}
                onPointerUp={(e) => {
                    // Touch/pen: the pointer is gone after lift — scatter.
                    // Mouse: still hovering, keep the glyph assembled.
                    if (e.pointerType !== "mouse") endPointer();
                }}
                onPointerCancel={endPointer}
                onPointerLeave={endPointer}
            />
        </div>
    );
}
