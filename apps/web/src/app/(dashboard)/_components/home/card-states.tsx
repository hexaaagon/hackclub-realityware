"use client";

import { ArrowClockwiseIcon } from "@phosphor-icons/react";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4"];

/** Shimmer skeletons while a card grid loads. */
export function CardSkeletonGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {SKELETON_KEYS.slice(0, count).map((k) => (
        <div
          key={k}
          className="h-32 animate-shimmer border-2 border-black/20 bg-[length:200%_100%] bg-[linear-gradient(90deg,#e9ecef,#f6f7f9,#e9ecef)]"
        />
      ))}
    </div>
  );
}

/** Inline error row with a retry button. */
export function ErrorRow({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-2 border-black/20 bg-card p-4 text-black/60 text-sm">
      <span>{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 border-2 border-black/20 px-2.5 py-1 font-medium text-black text-xs transition-colors hover:bg-orange/10"
      >
        <ArrowClockwiseIcon className="size-3.5" />
        Retry
      </button>
    </div>
  );
}
