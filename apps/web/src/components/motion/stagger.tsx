"use client";

import { cn } from "@realityware/util";
import { type MotionProps, motion, useReducedMotion } from "motion/react";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { revealVariants, SPRING } from "./tokens";

const MotionSlot = motion.create(Slot.Root);

type StaggerProps = ComponentProps<typeof motion.div> & {
  /** Delay between each child (seconds, default 0.06). */
  stagger?: number;
  /** Delay before the first child (seconds). */
  delayChildren?: number;
  repeat?: boolean;
  amount?: number | "some" | "all";
};

/** Orchestrates staggered reveals for its <StaggerItem> children. */
export function Stagger({
  stagger = 0.06,
  delayChildren = 0,
  repeat = false,
  amount = 0.2,
  className,
  children,
  ...props
}: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount }}
      variants={{
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = ComponentProps<typeof motion.div> & {
  asChild?: boolean;
};

/** A single staggered child. Inherits the active variant label from <Stagger>. */
export function StaggerItem({
  asChild = false,
  className,
  children,
  ...props
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  const Comp = (asChild ? MotionSlot : motion.div) as typeof motion.div;

  // No initial/animate here — the label cascades from the parent <Stagger>.
  const animation: MotionProps = reduce
    ? {}
    : { variants: revealVariants, transition: SPRING.gentle };

  return (
    <Comp className={cn(className)} {...animation} {...props}>
      {children}
    </Comp>
  );
}
