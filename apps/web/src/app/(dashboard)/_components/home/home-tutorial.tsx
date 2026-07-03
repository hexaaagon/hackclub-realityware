"use client";

import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  EASE,
  ShardBurst,
  type ShardBurstHandle,
  SPRING,
} from "@/components/motion";

// Placeholder step copy.
const STEPS = [
  "Join the #realityware Slack channel",
  "Set up Hackatime time tracking",
  "Ship your first project",
  "Earn your first shards",
  "Claim a reward in the shop",
];
const STORAGE_KEY = "rw:tutorial:v1";

/** Collapsible 5-step onboarding tutorial with persisted completion + reward burst. */
export function HomeTutorial() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [done, setDone] = useState<boolean[]>(() => STEPS.map(() => false));
  const burst = useRef<ShardBurstHandle>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length === STEPS.length) {
        setDone(parsed.map(Boolean));
      }
    } catch {
      // ignore malformed/blocked storage
    }
  }, []);

  function toggle(i: number) {
    // Fire the reward in the event handler (not inside the state updater, which
    // runs during render) so we never setState ShardBurst mid-render.
    if (!done[i]) burst.current?.fire({ count: 10 });
    setDone((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore blocked storage
      }
      return next;
    });
  }

  const completed = done.filter(Boolean).length;
  const stepLabel = Math.min(completed + 1, STEPS.length);

  return (
    <div className="relative border-2 border-black/20 bg-card">
      <ShardBurst ref={burst} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 font-medium">
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={reduce ? { duration: 0 } : SPRING.gentle}
            className="inline-flex"
          >
            <CaretRightIcon className="size-4" />
          </motion.span>
          Tutorial
        </span>
        <span className="text-black/40 text-xs">Step {stepLabel}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="tutorial-body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-black/20 border-t-2 p-4">
              <p className="text-black/50 text-sm">
                Additional cookies are rewarded upon completion of various
                stages of the tutorial, so complete all {STEPS.length} steps!
              </p>

              <div className="h-2 w-full overflow-hidden border-2 border-black/20 bg-background">
                <motion.div
                  className="h-full bg-green"
                  initial={false}
                  animate={{ width: `${(completed / STEPS.length) * 100}%` }}
                  transition={reduce ? { duration: 0 } : SPRING.gentle}
                />
              </div>

              <ul className="flex flex-col">
                {STEPS.map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-pressed={done[i]}
                      className="group flex w-full items-center gap-2.5 py-1.5 text-left text-sm"
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center border-2 transition-colors",
                          done[i]
                            ? "border-green bg-green/15 text-green"
                            : "border-black/20 text-transparent group-hover:border-black/40",
                        )}
                      >
                        <AnimatePresence>
                          {done[i] && (
                            <motion.span
                              initial={reduce ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={SPRING.bouncy}
                            >
                              <CheckIcon weight="bold" className="size-3" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span
                        className={cn(
                          done[i]
                            ? "text-black/45 line-through"
                            : "text-black/80",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
