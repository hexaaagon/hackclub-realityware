import { cn } from "@realityware/util";
import type { ComponentProps } from "react";

/** Section title — Sacco, uppercase (FEATURED / YOUR PROJECTS). */
export function SectionHeading({
  className,
  children,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-sacco text-2xl text-black uppercase tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
