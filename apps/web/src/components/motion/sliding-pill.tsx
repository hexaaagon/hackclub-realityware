"use client";

import { cn } from "@realityware/util";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentProps, type ReactNode, useId } from "react";
import { SPRING, type SpringName } from "./tokens";

type SlidingPillProps = ComponentProps<typeof motion.span> & {
  /** Shared id — must be unique per pill group. Slides between active items. */
  layoutId?: string;
  spring?: SpringName;
};

/**
 * Low-level animated active indicator. Drop inside whichever item is active
 * (e.g. the current sidebar route) sharing a `layoutId` so it slides over.
 */
export function SlidingPill({
  layoutId = "sliding-pill",
  spring = "gentle",
  className,
  ...props
}: SlidingPillProps) {
  return (
    <motion.span
      aria-hidden
      layoutId={layoutId}
      transition={SPRING[spring]}
      className={cn(
        "absolute inset-0 -z-0 border-2 border-black/20 bg-orange/15",
        className,
      )}
      {...props}
    />
  );
}

export type SlidingTabItem<T extends string = string> = {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
};

type SlidingTabsProps<T extends string = string> = Omit<
  ComponentProps<"div">,
  "onChange"
> & {
  items: SlidingTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  layoutId?: string;
  spring?: SpringName;
  pillClassName?: string;
};

/** Self-contained animated tab/toggle for shop, journals↔gallery, regions, etc. */
export function SlidingTabs<T extends string = string>({
  items,
  active,
  onChange,
  layoutId,
  spring = "gentle",
  pillClassName,
  className,
  ...props
}: SlidingTabsProps<T>) {
  const reduce = useReducedMotion();
  const autoId = useId();
  const pillId = layoutId ?? `sliding-tabs-${autoId}`;
  const pillClasses = cn(
    "absolute inset-0 -z-0 border-2 border-black/20 bg-orange/15",
    pillClassName,
  );

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 border-2 border-black/20 bg-card p-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 py-1.5 font-sacco text-sm transition-colors",
              isActive ? "text-black" : "text-black/50 hover:text-black/80",
            )}
          >
            {isActive &&
              (reduce ? (
                <span aria-hidden className={pillClasses} />
              ) : (
                <motion.span
                  aria-hidden
                  layoutId={pillId}
                  transition={SPRING[spring]}
                  className={pillClasses}
                />
              ))}
            {item.icon}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
