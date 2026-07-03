"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { DURATION, EASE } from "./tokens";

/**
 * Route-level enter transition. Enter-only by design: the App Router
 * re-instantiates template.tsx per navigation, so the outgoing tree is gone
 * before an exit could run — enter-only is robust and back/forward safe.
 * Skips the first paint (server + hydration both render the final state) so a
 * hard reload paints instantly with no fade-in flash or hydration mismatch;
 * only client-side navigations animate. Mount flag lives in state (not a
 * render-time ref mutation) so React StrictMode's double render is consistent.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  const skip = !hasMounted || reduce;

  return (
    <motion.div
      key={pathname}
      initial={skip ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
