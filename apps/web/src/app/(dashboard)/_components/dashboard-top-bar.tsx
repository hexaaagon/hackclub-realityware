"use client";

import Image from "next/image";
import Link from "next/link";
import RealitywareLogo from "#/images/realityware.svg";
import { CountUp } from "@/components/motion";
import type { DashboardData } from "../_data";
import { EstClock } from "./est-clock";
import { MobileMenu } from "./mobile-menu";

/**
 * Content top bar. Desktop: "● N people coding today" pill + EST clock,
 * right-aligned. Mobile (<lg): a hamburger + logo on the left, compact stats
 * on the right.
 */
export function DashboardTopBar({
  onlineCount,
  data,
}: {
  onlineCount: number;
  data: DashboardData;
}) {
  return (
    <div className="relative z-10 flex items-center justify-between gap-3 border-black/20 border-b-2 px-4 py-3 lg:justify-end lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <MobileMenu data={data} />
        <Link href="/" aria-label="Realityware home" className="inline-flex">
          <Image
            src={RealitywareLogo}
            alt="Realityware"
            className="h-6 w-auto"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-2 border-2 border-black/20 bg-card px-3 py-1">
          <span
            aria-hidden
            className="size-2 animate-pulse-glow rounded-full bg-green"
          />
          <span className="text-black/70 text-xs">
            <CountUp
              value={onlineCount}
              animateOnMount
              className="font-medium text-black"
            />
            <span aria-hidden> coding today</span>
            <span className="sr-only"> people coding today</span>
          </span>
        </span>
        <div className="hidden min-[400px]:block">
          <EstClock />
        </div>
      </div>
    </div>
  );
}
