"use client";

import { cn } from "@realityware/util";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { SPRING } from "./tokens";

type StickerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Idle resting rotation in degrees (default -6). */
  rotate?: number;
};

/**
 * A draggable graffiti sticker that springs back to its origin on release.
 * Honors prefers-reduced-motion (renders a plain, non-draggable element).
 */
export function Sticker({
  children,
  className,
  style,
  rotate = -6,
}: StickerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={{ rotate: `${rotate}deg`, ...style }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      dragMomentum={false}
      whileTap={{ scale: 1.12, cursor: "grabbing" }}
      whileHover={{ scale: 1.05, rotate: rotate + 3 }}
      transition={SPRING.bouncy}
      initial={{ rotate }}
      animate={{ rotate }}
      className={cn("cursor-grab touch-none select-none", className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
