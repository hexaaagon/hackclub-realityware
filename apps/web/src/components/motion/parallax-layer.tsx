"use client";

import { cn } from "@realityware/util";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ComponentProps, useEffect, useRef } from "react";
import { SPRING } from "./tokens";

type ParallaxLayerProps = ComponentProps<typeof motion.div> & {
  /** Fraction of scroll distance to drift (neg = opposite, default 0.3). */
  speed?: number;
  axis?: "x" | "y";
  /** Add a subtle mouse-follow drift on top of scroll. */
  mouse?: boolean;
  /** Max mouse offset in px (default 12). */
  mouseStrength?: number;
};

/** Scroll- (and optionally mouse-) linked drift for hero/graffiti layers. */
export function ParallaxLayer({
  speed = 0.3,
  axis = "y",
  mouse = false,
  mouseStrength = 12,
  className,
  children,
  style,
  ...props
}: ParallaxLayerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scroll = useSpring(
    useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]),
    SPRING.gentle,
  );

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, SPRING.gentle);
  const smy = useSpring(my, SPRING.gentle);

  const x = useTransform(
    [scroll, smx],
    ([s, m]: number[]) => (axis === "x" ? s : 0) + (mouse ? m : 0),
  );
  const y = useTransform(
    [scroll, smy],
    ([s, m]: number[]) => (axis === "y" ? s : 0) + (mouse ? m : 0),
  );

  useEffect(() => {
    if (!mouse || reduce) return;
    let frame = 0;
    function onMove(e: MouseEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        mx.set((e.clientX / window.innerWidth - 0.5) * mouseStrength * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * mouseStrength * 2);
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mouse, reduce, mouseStrength, mx, my]);

  if (reduce) {
    return (
      <motion.div ref={ref} className={cn(className)} style={style}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{ ...style, x, y }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
