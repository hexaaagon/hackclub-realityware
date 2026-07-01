"use client";

import { cn } from "@realityware/util";
import { useReducedMotion } from "motion/react";
import type { ComponentProps, CSSProperties } from "react";

type MarqueeProps = ComponentProps<"div"> & {
  /** Seconds for one full loop (default 20). */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  /** Gap between repeated items (default "2rem"). */
  gap?: number | string;
};

/** Infinite, GPU-composited ticker. Pauses on hover. */
export function Marquee({
  speed = 20,
  direction = "left",
  pauseOnHover = true,
  gap = "2rem",
  className,
  children,
  style,
  ...props
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const groupStyle: CSSProperties = { gap, paddingRight: gap };

  if (reduce) {
    return (
      <div
        className={cn("flex overflow-hidden", className)}
        style={style}
        {...props}
      >
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("group flex overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div
        className={cn(
          "flex w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--marquee-duration": `${speed}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center" style={groupStyle}>
          {children}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center"
          style={groupStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
