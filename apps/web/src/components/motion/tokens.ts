import type { Transition, Variants } from "motion/react";

/**
 * Shared motion tokens — define once, reuse everywhere (see MOTION.md).
 * Mirrored as CSS vars (`--duration-*`) in globals.css for CSS-only utilities.
 * Safe to import from Server Components (no "use client", no runtime motion deps).
 */

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** Non-spring tween easing (cubic-bezier). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Spring presets — playful + snappy. */
export const SPRING = {
  bouncy: { type: "spring", stiffness: 420, damping: 18 },
  gentle: { type: "spring", stiffness: 260, damping: 26 },
  stiff: { type: "spring", stiffness: 600, damping: 30 },
} as const satisfies Record<string, Transition>;

/** Ready-made tween transitions keyed to the brand durations. */
export const TWEEN = {
  fast: { duration: DURATION.fast, ease: EASE },
  base: { duration: DURATION.base, ease: EASE },
  slow: { duration: DURATION.slow, ease: EASE },
} as const satisfies Record<string, Transition>;

/**
 * Shared reveal variants — reused by <Reveal> and <StaggerItem> so scroll-in
 * motion stays consistent. `exit` lets list items animate out under
 * <AnimatePresence> (star toggle, new journal, etc).
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

export type SpringName = keyof typeof SPRING;
export type DurationName = keyof typeof DURATION;
