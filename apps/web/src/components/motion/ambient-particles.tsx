"use client";

import { cn } from "@realityware/util";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";

// Lazy, client-only — keeps the WebGL/OGL bundle out of SSR and off the
// critical path. Brand-tinted, low opacity, ambient only (behind content).
const Particles = dynamic(() => import("@/components/ui/particles-bg"), {
  ssr: false,
});

/**
 * Ambient brand particle field for a hero background. Renders nothing when the
 * user prefers reduced motion. Place as the first child of a `relative
 * overflow-hidden` hero; keep at most one per screen (MOTION.md).
 */
export function AmbientParticles({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-50",
        className,
      )}
    >
      <Particles
        className="h-full w-full"
        particleColors={["ff551f", "0cb463", "2de1fc"]}
        particleCount={90}
        particleSpread={11}
        speed={0.05}
        particleBaseSize={70}
        alphaParticles
        disableRotation={false}
      />
    </div>
  );
}
