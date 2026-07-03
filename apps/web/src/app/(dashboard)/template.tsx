"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/components/motion";

/**
 * Dashboard content transition. A template (not the layout) so it re-runs the
 * enter animation on every navigation while the sidebar in (dashboard)/layout.tsx
 * persists — which is what lets the active-nav SlidingPill slide between routes.
 * `initial` is constant (no SSR mismatch); reduced motion makes the settle instant.
 */
export default function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce ? { duration: 0 } : { duration: DURATION.base, ease: EASE }
      }
    >
      {children}
    </motion.div>
  );
}
