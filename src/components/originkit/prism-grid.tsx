// Originkit "Prism Grid" — a 3D-tilted grid of bordered cells that light up
// with random prism colors under the pointer and fade out behind it. The
// hovered cell is found by inverting the grid's perspective projection
// (screenToPlane) instead of hit-testing DOM nodes.
// Source: Originkit Prism Grid (BackgroundBoxes base). Reworked: responsive
// cell caps (maxCols × maxRows ceiling via adaptive box size), bounded fade
// queue, prefers-reduced-motion support, motion/react, strict TypeScript,
// and a transform/projection order fix (see the grid transform comment).
"use client";

import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type JSX,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "motion/react";

/** Perspective distance (px) shared by the CSS transform and the projection. */
const PERSPECTIVE = 1000;

/**
 * Cap on concurrently tracked fading cells. The source let this list grow
 * unbounded during fast pointer sweeps; overflowing entries drop the oldest.
 */
const MAX_FADING_CELLS = 24;

/** Reduced motion: cells never animate; removal happens after this fixed delay. */
const REDUCED_MOTION_REMOVE_MS = 350;

/** Debounce for the window resize listener that re-measures the container. */
const RESIZE_DEBOUNCE_MS = 120;

const DEFAULT_COLORS: string[] = [
    "#FFFFFF",
    "#FFC2E3",
    "#DEFFEA",
    "#A68F1F",
    "#A85E5E",
    "#DFC2FF",
];

const DEFAULT_TILT = { x: 30, y: 0 };

/**
 * Reduced-motion preference, detected exactly once (module-level) so repeated
 * renders never re-query matchMedia. Server render evaluates to false.
 */
const PREFERS_REDUCED_MOTION =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Inverse-perspective projection (ported verbatim from Originkit): maps a
 * screen point — relative to the perspective origin — back onto the z = 0
 * plane of a grid rendered with CSS `rotateX(pitchDeg) rotateY(yawDeg)` under
 * `p` px of perspective (verified to round-trip to ~1e-13). Returns null
 * when the sight ray is (near-)parallel to the plane.
 */
function screenToPlane(
    sx: number,
    sy: number,
    yawDeg: number,
    pitchDeg: number,
    p = PERSPECTIVE
): { x: number; y: number } | null {
    const a = (yawDeg * Math.PI) / 180;
    const b = (pitchDeg * Math.PI) / 180;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const cb = Math.cos(b);
    const sb = Math.sin(b);

    const a11 = p * ca - sx * sa * cb;
    const a12 = sx * sb;
    const a21 = p * sa * sb - sy * sa * cb;
    const a22 = p * cb + sy * sb;

    const det = a11 * a22 - a12 * a21;
    if (!isFinite(det) || Math.abs(det) < 1e-6) return null;

    const b1 = sx * p;
    const b2 = sy * p;
    return {
        x: (b1 * a22 - a12 * b2) / det,
        y: (a11 * b2 - b1 * a21) / det,
    };
}

interface Cell {
    id: number;
    row: number;
    col: number;
    color: string;
}

export type PrismGridProps = {
    /** Prism palette cycled randomly on lit cells. */
    colors?: string[];
    /** Base cell size in px (grows automatically to cap column count). */
    boxSize?: number;
    /** Max grid columns (responsiveness cap). */
    maxCols?: number;
    /** Max grid rows. */
    maxRows?: number;
    /** 3D tilt in degrees (rotateY = tilt.y, rotateX = tilt.x). */
    tilt?: { x: number; y: number };
    borderWidth?: number;
    borderColor?: string;
    /** Section background behind the grid (transparent by default). */
    backgroundColor?: string;
    /** Cell fade-out duration seconds. */
    fadeDuration?: number;
    className?: string;
};

export default function PrismGrid({
    colors = DEFAULT_COLORS,
    boxSize = 44,
    maxCols = 24,
    maxRows = 24,
    tilt = DEFAULT_TILT,
    borderWidth = 1,
    borderColor = "rgba(255,255,255,0.16)",
    backgroundColor = "transparent",
    fadeDuration = 1,
    className,
}: PrismGridProps): JSX.Element {
    // Light-touch sanitisation: garbage numerics must never poison the
    // transform string or the projection math with NaN.
    const safeBoxSize = Math.max(1, boxSize || 1);
    const safeMaxCols = Math.max(1, Math.floor(maxCols || 1));
    const safeMaxRows = Math.max(1, Math.floor(maxRows || 1));
    const safeFadeSeconds = Math.max(0, fadeDuration || 0);

    // Spec mapping: rotateY = tilt.y (yaw), rotateX = tilt.x (pitch).
    const rotateXDeg = tilt?.x ?? DEFAULT_TILT.x;
    const rotateYDeg = tilt?.y ?? DEFAULT_TILT.y;

    const palette = useMemo(() => {
        const entries = colors.filter(
            (color) => typeof color === "string" && color.trim().length > 0
        );
        return entries.length > 0 ? entries : DEFAULT_COLORS;
    }, [colors]);

    const pickColor = useCallback(() => {
        return palette[Math.floor(Math.random() * palette.length)];
    }, [palette]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);

    const measure = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const width = Math.max(
            1,
            Math.round(container.clientWidth || container.offsetWidth || 1)
        );
        const height = Math.max(
            1,
            Math.round(container.clientHeight || container.offsetHeight || 1)
        );
        setSize((prev) =>
            prev && prev.width === width && prev.height === height
                ? prev
                : { width, height }
        );
    }, []);

    useLayoutEffect(() => {
        // Initial measure must run before first paint (source pattern), which
        // means setState inside the effect body — same precedent as page.tsx.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        measure();
        let timer: ReturnType<typeof setTimeout> | undefined;
        const handleResize = () => {
            if (timer !== undefined) clearTimeout(timer);
            timer = setTimeout(measure, RESIZE_DEBOUNCE_MS);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            if (timer !== undefined) clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, [measure]);

    // Responsive caps: the effective cell grows so the DOM never exceeds
    // maxCols × maxRows cells, whatever the container size. Narrow (mobile)
    // containers simply keep the base box size, so cells are naturally
    // bigger and fewer on small screens.
    const measured = size !== null;
    const width = size ? size.width : 1;
    const height = size ? size.height : 1;
    const effectiveBoxSize = Math.max(
        safeBoxSize,
        Math.ceil(width / safeMaxCols),
        Math.ceil(height / safeMaxRows)
    );
    const cols = Math.max(1, Math.ceil(width / effectiveBoxSize));
    const rows = Math.max(1, Math.ceil(height / effectiveBoxSize));
    const gridWidth = cols * effectiveBoxSize;
    const gridHeight = rows * effectiveBoxSize;

    const [lit, setLit] = useState<Cell | null>(null);
    const [fading, setFading] = useState<Cell[]>([]);
    // Mirror of `lit` so pointer handlers never read a stale cell across
    // batched continuous events (React may defer the re-render between
    // pointermove dispatches). Ref mutation is synchronous.
    const litRef = useRef<Cell | null>(null);
    const idRef = useRef(0);

    /** Pure updater: append a cell, dropping the oldest beyond the cap. */
    const enqueueFade = useCallback((cell: Cell) => {
        setFading((current) => {
            const next = [...current, cell];
            return next.length > MAX_FADING_CELLS
                ? next.slice(next.length - MAX_FADING_CELLS)
                : next;
        });
    }, []);

    const leave = useCallback(() => {
        const current = litRef.current;
        if (!current) return;
        litRef.current = null;
        setLit(null);
        enqueueFade(current);
    }, [enqueueFade]);

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const sx = event.clientX - rect.left - rect.width / 2;
            const sy = event.clientY - rect.top - rect.height / 2;

            // Source convention: first angle = rotateY (yaw), second = rotateX (pitch).
            const point = screenToPlane(sx, sy, rotateYDeg, rotateXDeg);
            if (!point) return leave();

            const gx = point.x + gridWidth / 2;
            const gy = point.y + gridHeight / 2;
            const col = Math.floor(gx / effectiveBoxSize);
            const row = Math.floor(gy / effectiveBoxSize);
            if (col < 0 || col >= cols || row < 0 || row >= rows) return leave();

            const current = litRef.current;
            if (current && current.row === row && current.col === col) return;

            const next: Cell = {
                id: ++idRef.current,
                row,
                col,
                color: pickColor(),
            };
            if (current) enqueueFade(current);
            litRef.current = next;
            setLit(next);
        },
        [
            rotateYDeg,
            rotateXDeg,
            gridWidth,
            gridHeight,
            effectiveBoxSize,
            cols,
            rows,
            pickColor,
            enqueueFade,
            leave,
        ]
    );

    // Source timer pattern: drain the fade queue one cell per delay. Under
    // reduced motion the delay is a fixed 350ms and nothing animates.
    const removalDelayMs = PREFERS_REDUCED_MOTION
        ? REDUCED_MOTION_REMOVE_MS
        : Math.round(safeFadeSeconds * 1000);

    useLayoutEffect(() => {
        if (fading.length === 0) return;
        const timer = setTimeout(() => {
            setFading((current) => current.slice(1));
        }, removalDelayMs);
        return () => clearTimeout(timer);
    }, [fading, removalDelayMs]);

    const border =
        borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined;

    // Static grid skeleton — rebuilt only when geometry changes.
    const boxes = useMemo(() => {
        return Array.from({ length: rows }, (_, i) => (
            <div
                key={`row-${i}`}
                style={{
                    display: "flex",
                    borderLeft: border,
                    borderBottom: i === rows - 1 ? border : undefined,
                }}
            >
                {Array.from({ length: cols }, (_, j) => (
                    <div
                        key={`col-${j}`}
                        style={{
                            width: `${effectiveBoxSize}px`,
                            height: `${effectiveBoxSize}px`,
                            flexShrink: 0,
                            boxSizing: "border-box",
                            borderRight: border,
                            borderTop: border,
                        }}
                    />
                ))}
            </div>
        ));
    }, [rows, cols, effectiveBoxSize, border]);

    const cellStyle = (cell: Cell): CSSProperties => ({
        position: "absolute",
        left: cell.col * effectiveBoxSize,
        top: cell.row * effectiveBoxSize,
        width: effectiveBoxSize,
        height: effectiveBoxSize,
        backgroundColor: cell.color,
        pointerEvents: "none",
    });

    return (
        <div
            ref={containerRef}
            className={className}
            onPointerMove={handlePointerMove}
            onPointerLeave={leave}
            // Touch: when the browser takes the gesture over for scrolling it
            // fires pointercancel — retire the lit cell instead of freezing it.
            onPointerCancel={leave}
            // Touch tap-to-light: a pointerdown lights the cell under the
            // finger immediately (before any scroll claim), so taps and
            // drags both paint the field on hover-less devices. Mouse/pen
            // taps behave exactly like a pointermove.
            onPointerDown={handlePointerMove}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor,
            }}
        >
            {measured && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        perspective: `${PERSPECTIVE}px`,
                        perspectiveOrigin: "center center",
                        transformStyle: "preserve-3d",
                    }}
                >
                    <div
                        style={{
                            // Order matters: screenToPlane inverts exactly
                            // rotateX(pitch) · rotateY(yaw). The source emitted
                            // "rotateY rotateX", which is only equivalent when
                            // one axis is zero (true for every Originkit
                            // preset) — reordered so dual-axis tilts hit-test
                            // exactly too. Identical output for single-axis
                            // tilts such as the default { x: 30, y: 0 }.
                            transform: `translate(-50%, -50%) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`,
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            display: "flex",
                            flexDirection: "column",
                            transformOrigin: "center center",
                            width: `${gridWidth}px`,
                            height: `${gridHeight}px`,
                            zIndex: 0,
                        }}
                    >
                        {boxes}
                        {PREFERS_REDUCED_MOTION
                            ? fading.map((cell) => (
                                  <div key={cell.id} style={cellStyle(cell)} />
                              ))
                            : fading.map((cell) => (
                                  <motion.div
                                      key={cell.id}
                                      initial={{ opacity: 1 }}
                                      animate={{ opacity: 0 }}
                                      transition={{ duration: safeFadeSeconds }}
                                      style={cellStyle(cell)}
                                  />
                              ))}
                        {lit &&
                            (PREFERS_REDUCED_MOTION ? (
                                <div key={lit.id} style={cellStyle(lit)} />
                            ) : (
                                <motion.div
                                    key={lit.id}
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0 }}
                                    style={cellStyle(lit)}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
