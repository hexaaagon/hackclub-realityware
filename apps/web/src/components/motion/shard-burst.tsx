"use client";

import { cn } from "@realityware/util";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  type Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SPRING } from "./tokens";

export type ShardBurstHandle = {
  fire: (opts?: { count?: number }) => void;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  glyph: string;
};

type Burst = { id: number; particles: Particle[] };

type ShardBurstProps = Omit<ComponentProps<"div">, "ref"> & {
  ref?: Ref<ShardBurstHandle>;
  /** Particles per burst (default 14). */
  count?: number;
  /** Radial distance in px (default 120). */
  spread?: number;
  /** Burst lifetime in seconds (default 0.7). */
  duration?: number;
  /** Particle glyphs (default shard/sticker set). */
  glyphs?: string[];
};

const DEFAULT_GLYPHS = ["🍪", "✦", "★", "⬡", "🔶"];

/**
 * Celebratory shard burst. Fire imperatively on reward events:
 *   const ref = useRef<ShardBurstHandle>(null);
 *   <ShardBurst ref={ref} /> ... ref.current?.fire()
 */
export function ShardBurst({
  ref,
  count = 14,
  spread = 120,
  duration = 0.7,
  glyphs = DEFAULT_GLYPHS,
  className,
  ...props
}: ShardBurstProps) {
  const reduce = useReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const particleId = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      fire: (opts) => {
        if (reduce) return; // bursts are purely celebratory / non-essential
        const n = opts?.count ?? count;
        const particles: Particle[] = Array.from({ length: n }, () => {
          const angle = Math.random() * Math.PI * 2;
          const dist = spread * (0.5 + Math.random() * 0.5);
          return {
            id: particleId.current++,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - spread * 0.3, // slight upward bias
            rotate: (Math.random() - 0.5) * 540,
            scale: 0.6 + Math.random() * 0.8,
            glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          };
        });
        setBursts((b) => [...b, { id: burstId.current++, particles }]);
      },
    }),
    [reduce, count, spread, glyphs],
  );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-visible",
        className,
      )}
      {...props}
    >
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute top-1/2 left-1/2">
          {burst.particles.map((p, i) => (
            <motion.span
              key={p.id}
              className="absolute block select-none text-lg"
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{
                opacity: 0,
                x: p.x,
                y: p.y,
                scale: p.scale,
                rotate: p.rotate,
              }}
              transition={{ ...SPRING.bouncy, duration }}
              onAnimationComplete={
                i === 0
                  ? () => setBursts((b) => b.filter((x) => x.id !== burst.id))
                  : undefined
              }
            >
              {p.glyph}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}
