"use client";

import { cn } from "@realityware/util";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { type ComponentProps, useEffect } from "react";
import { SPRING, TWEEN } from "./tokens";

type CountUpProps = Omit<ComponentProps<typeof motion.span>, "children"> & {
  value: number;
  decimals?: number;
  /** Tween duration when `spring` is false (seconds). */
  duration?: number;
  /** Use a spring (default) vs a tween. */
  spring?: boolean;
  /** Custom number formatter (overrides decimals/grouping). */
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  /** Roll up from 0 on first mount (default false). */
  animateOnMount?: boolean;
};

/** Animates a number whenever `value` changes (shards, counters, scores). */
export function CountUp({
  value,
  decimals = 0,
  duration,
  spring = true,
  format,
  prefix,
  suffix,
  animateOnMount = false,
  className,
  ...props
}: CountUpProps) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(animateOnMount ? 0 : value);

  const formatter =
    format ??
    ((n: number) =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(n));

  const text = useTransform(mv, (latest) => formatter(latest));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(
      mv,
      value,
      spring
        ? SPRING.gentle
        : { ...TWEEN.slow, ...(duration ? { duration } : {}) },
    );
    return () => controls.stop();
  }, [value, reduce, spring, duration, mv]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span {...props}>{text}</motion.span>
      {suffix}
    </span>
  );
}
