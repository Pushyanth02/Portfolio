// Lightswind UI "Dock" — macOS-style magnifying dock (source: Lightswind UI, MIT).
//
// Reworked for this site:
// - clientX coords fix — the source tracked `pageX` but measured items with
//   `getBoundingClientRect().x` (client coords), so magnification broke on any
//   scrolled page. Pointer tracking is clientX end-to-end now.
// - Reserved height, no layout animation — the source spring-animated the
//   wrapper height; here the wrapper has a FIXED reserved height and the panel
//   aligns to the bottom via flex-end. Only the per-item size springs move.
// - Touch adaptation — magnification runs only on `(hover: hover) and
//   (pointer: fine)` devices; touch renders static base-size items (no mouse
//   tracking, no height growth, fully tappable, ≥44px hit targets).
// - Keyboard a11y — role="toolbar" panel, role="button" items with Enter/Space
//   activation, and labels shown on focus as well as hover.
// - Reduced motion — magnification springs disabled (static base size) and the
//   hover label only fades (no slide).
// - Neutral structure, skinned externally via the `lsw-dock-*` class hooks.

"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type JSX,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/** Spring configuration for the per-item magnification springs. */
export type DockSpring = { mass: number; stiffness: number; damping: number };

export type DockItemDef = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Called with the click event (keyboard activation passes none). */
  onClick: (event?: ReactMouseEvent<HTMLDivElement>) => void;
  /** Small numeric badge (e.g. count). */
  badge?: number;
  /** Marks the item as the current section (active styling hook). */
  active?: boolean;
  /** Extra classes for the item root — per-skin hooks (e.g. section tints). */
  className?: string;
};

export type DockProps = {
  items: DockItemDef[];
  className?: string;
  /** Base item size px. */
  baseItemSize?: number;
  /** Max magnified size px. */
  magnification?: number;
  /** Pointer distance px influencing neighbors. */
  distance?: number;
  spring?: DockSpring;
};

/** Minimum touch-target hit area (px) enforced on every item. */
const MIN_TOUCH_TARGET = 44;
/** Room under the items reserved for the active dot (px). */
const DOT_WELL = 12;
const DEFAULT_SPRING: DockSpring = {
  mass: 0.1,
  stiffness: 170,
  damping: 13,
};

type PointerCaps = {
  /** Fine pointer with hover AND motion allowed → magnification runs. */
  magnify: boolean;
  /** User prefers reduced motion. */
  reducedMotion: boolean;
};

/** No-op subscription: capability probes are read once, never tracked. */
const subscribeNoop = () => () => {};
/** Server / pre-hydration snapshot: assume an animating desktop pointer. */
const getServerFalse = () => false;

let finePointerCache: boolean | null = null;
let reducedMotionCache: boolean | null = null;

/** `(hover: hover) and (pointer: fine)` — probed once, then cached. */
const hasFineHoverPointer = () =>
  (finePointerCache ??= window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches);

/** `(prefers-reduced-motion: reduce)` — probed once, then cached. */
const prefersReducedMotion = () =>
  (reducedMotionCache ??= window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches);

/**
 * Device capabilities, probed once via useSyncExternalStore (hydration-safe:
 * the server and first client render assume a desktop pointer, then the real
 * capability flips in right after mount without an effect or mismatch).
 */
function usePointerCaps(): PointerCaps {
  const finePointer = useSyncExternalStore(
    subscribeNoop,
    hasFineHoverPointer,
    getServerFalse
  );
  const reducedMotion = useSyncExternalStore(
    subscribeNoop,
    prefersReducedMotion,
    getServerFalse
  );
  return { magnify: finePointer && !reducedMotion, reducedMotion };
}

/**
 * Per-item magnified size spring. `mouseX` carries *client* coordinates and is
 * compared against `getBoundingClientRect().x` (also client) — see the header
 * note about the source's pageX/client mismatch. On touch / reduced-motion
 * devices `mouseX` is never written, so the spring stays at the base size.
 */
function useDockItemSize(
  mouseX: MotionValue<number>,
  baseItemSize: number,
  magnification: number,
  distance: number,
  ref: RefObject<HTMLDivElement | null>,
  spring: DockSpring
): MotionValue<number> {
  // Half of the resting hit box — a stable anchor for the distance profile
  // (measuring the live center would feed the item's own growth back in and
  // make the peak drift with the cursor).
  const halfWidth = Math.max(MIN_TOUCH_TARGET, baseItemSize) / 2;
  // useTransform needs a strictly increasing input range.
  const range = Math.max(1, distance);

  const mouseDistance = useTransform(mouseX, (val) => {
    if (!Number.isFinite(val)) return Number.POSITIVE_INFINITY;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Number.POSITIVE_INFINITY;
    return val - rect.x - halfWidth;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-range, 0, range],
    [baseItemSize, magnification, baseItemSize]
  );

  return useSpring(targetSize, spring);
}

type DockItemViewProps = {
  def: DockItemDef;
  mouseX: MotionValue<number>;
  baseItemSize: number;
  magnification: number;
  distance: number;
  spring: DockSpring;
  reducedMotion: boolean;
};

function DockItemView({
  def,
  mouseX,
  baseItemSize,
  magnification,
  distance,
  spring,
  reducedMotion,
}: DockItemViewProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [showLabel, setShowLabel] = useState(false);

  const size = useDockItemSize(
    mouseX,
    baseItemSize,
    magnification,
    distance,
    ref,
    spring
  );

  // The hit box floors at the 44px touch-target minimum; the visual tile
  // tracks the magnified size exactly (it may be smaller than the hit box).
  const hitSize = useTransform(size, (v) => Math.max(MIN_TOUCH_TARGET, v));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      def.onClick();
    }
  };

  const classes = def.active
    ? `lsw-dock-item is-active${def.className ? ` ${def.className}` : ""}`
    : `lsw-dock-item${def.className ? ` ${def.className}` : ""}`;

  return (
    <motion.div
      ref={ref}
      className={classes}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: hitSize,
        height: hitSize,
      }}
      role="button"
      tabIndex={0}
      aria-label={def.label}
      aria-current={def.active ? "true" : undefined}
      onClick={(event) => def.onClick(event)}
      onKeyDown={handleKeyDown}
      onHoverStart={() => setShowLabel(true)}
      onHoverEnd={() => setShowLabel(false)}
      onFocus={() => setShowLabel(true)}
      onBlur={() => setShowLabel(false)}
    >
      <motion.div
        className="lsw-dock-item-visual"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
        }}
      >
        {def.icon}
      </motion.div>

      {def.badge !== undefined && def.badge > 0 && (
        <span
          className="lsw-dock-badge"
          style={{ position: "absolute", top: "-5px", right: "-5px" }}
        >
          {def.badge > 99 ? "99+" : def.badge}
        </span>
      )}

      <AnimatePresence>
        {showLabel && (
          <motion.div
            key="label"
            className="lsw-dock-label"
            role="tooltip"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: -10 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              left: "50%",
              bottom: "calc(100% + 10px)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              x: "-50%",
            }}
          >
            {def.label}
          </motion.div>
        )}
      </AnimatePresence>

      {def.active && (
        <span
          className="lsw-dock-active-dot"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-9px",
            width: "4px",
            height: "4px",
            marginLeft: "-2px",
            borderRadius: "9999px",
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * macOS-style magnifying dock. Pointer-proximity magnification via per-item
 * springs (desktop only); static, fully tappable items on touch. All visual
 * skinning is done externally through the `lsw-dock-*` class hooks.
 */
export default function Dock({
  items,
  className,
  baseItemSize = 46,
  magnification = 68,
  distance = 130,
  spring = DEFAULT_SPRING,
}: DockProps): JSX.Element {
  const caps = usePointerCaps();
  // clientX stream; Infinity = "pointer elsewhere" → every item rests at base.
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  const itemHit = Math.max(MIN_TOUCH_TARGET, baseItemSize);
  // Fixed panel height: items align to its bottom and magnified tiles poke
  // out above it — the panel box itself never animates.
  const panelHeight = itemHit + DOT_WELL;
  // Fixed reserved wrapper height (never animated — the source spring-animated
  // this, which is exactly the layout jank we removed). Touch / reduced-motion
  // gets the compact panel height instead of the magnification headroom.
  const reservedHeight = caps.magnify
    ? Math.max(magnification + magnification / 2 + 4, panelHeight)
    : panelHeight;

  return (
    <div
      className="lsw-dock"
      style={{
        height: reservedHeight,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      /* Tracked on the wrapper (not just the panel) so the cursor stays
         "inside" while it is over the magnified tiles that pop above the panel.
         POINTER EVENTS ONLY FROM A REAL MOUSE: some touch environments
         (iPadOS with pointer:fine, touch-screen laptops, older WebViews)
         dispatch synthetic mousemove events from taps — an unfiltered
         listener would set mouseX at the tap point with no mouseleave
         ever following, leaving the dock stuck magnified there. The
         pointerType filter + touch pointerdown reset keep magnification
         strictly mouse-driven on every device class. */
      onPointerMove={
        caps.magnify
          ? (event) => {
              if (event.pointerType === "mouse") mouseX.set(event.clientX);
            }
          : undefined
      }
      onPointerDown={
        caps.magnify
          ? (event) => {
              if (event.pointerType !== "mouse")
                mouseX.set(Number.POSITIVE_INFINITY);
            }
          : undefined
      }
      onMouseLeave={
        caps.magnify
          ? () => mouseX.set(Number.POSITIVE_INFINITY)
          : undefined
      }
    >
      <div
        role="toolbar"
        aria-label="Section dock"
        className={
          className ? `lsw-dock-panel ${className}` : "lsw-dock-panel"
        }
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: panelHeight,
          paddingBottom: DOT_WELL,
        }}
      >
        {items.map((item) => (
          <DockItemView
            key={item.id}
            def={item}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
            spring={spring}
            reducedMotion={caps.reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
