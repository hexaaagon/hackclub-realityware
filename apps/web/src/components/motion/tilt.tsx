"use client";

import { cn } from "@realityware/util";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Slot } from "radix-ui";
import type { ComponentProps, PointerEvent } from "react";
import { SPRING, type SpringName } from "./tokens";

const MotionSlot = motion.create(Slot.Root);

type TiltProps = ComponentProps<typeof motion.div> & {
  asChild?: boolean;
  /** Enable cursor-following 3D tilt on top of the hover-lift. */
  tilt?: boolean;
  /** Hover translateY in px (default 4). */
  lift?: number;
  /** Idle hover rotation / max tilt angle in deg (default 1). */
  rotate?: number;
  /** Hover scale (default 1.02). */
  scale?: number;
  /** Press scale (default 0.97). */
  press?: number;
  spring?: SpringName;
};

/** Hover-lift card wrapper; optional cursor-follow 3D tilt. */
export function Tilt({
  asChild = false,
  tilt = false,
  lift = 4,
  rotate = 1,
  scale = 1.02,
  press = 0.97,
  spring = "bouncy",
  className,
  children,
  style,
  ...props
}: TiltProps) {
  const reduce = useReducedMotion();

  // Hooks must run unconditionally even when tilt/reduce are off.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [rotate * 2, rotate * -2]),
    SPRING.gentle,
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [rotate * -2, rotate * 2]),
    SPRING.gentle,
  );

  const Comp = (asChild ? MotionSlot : motion.div) as typeof motion.div;

  if (reduce) {
    return (
      <Comp className={cn(className)} style={style} {...props}>
        {children}
      </Comp>
    );
  }

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <Comp
      className={cn(className)}
      style={
        tilt ? { ...style, rotateX, rotateY, transformPerspective: 800 } : style
      }
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
      whileHover={{ y: -lift, scale, rotate: tilt ? 0 : rotate }}
      whileTap={{ scale: press }}
      transition={SPRING[spring]}
      {...props}
    >
      {children}
    </Comp>
  );
}
