"use client";

import { cn } from "@realityware/util";
import { type MotionProps, motion, useReducedMotion } from "motion/react";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { revealVariants, TWEEN } from "./tokens";

// motion.create(Slot.Root) lets `asChild` forward the animation onto a semantic
// child element (e.g. <article>) instead of an extra wrapper div.
const MotionSlot = motion.create(Slot.Root);

type RevealProps = ComponentProps<typeof motion.div> & {
  asChild?: boolean;
  /** Slide-up distance in px (default 16). */
  y?: number;
  /** Delay before the reveal (seconds). */
  delay?: number;
  /** Re-run every time it scrolls into view (default false = once). */
  repeat?: boolean;
  /** Viewport intersection threshold (default 0.3). */
  amount?: number | "some" | "all";
};

/** Fade + slide-up + slight scale as the element scrolls into view. */
export function Reveal({
  asChild = false,
  y = 16,
  delay = 0,
  repeat = false,
  amount = 0.3,
  className,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = (asChild ? MotionSlot : motion.div) as typeof motion.div;

  const animation: MotionProps = reduce
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: !repeat, amount },
        variants:
          y === 16
            ? revealVariants
            : {
                hidden: { opacity: 0, y, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1 },
              },
        transition: { ...TWEEN.slow, delay },
      };

  return (
    <Comp className={cn(className)} {...animation} {...props}>
      {children}
    </Comp>
  );
}
