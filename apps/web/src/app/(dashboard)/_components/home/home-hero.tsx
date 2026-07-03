"use client";

import { StarIcon } from "@phosphor-icons/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import Graffiti from "#/images/graffiti.svg";
import { ParallaxLayer, Reveal } from "@/components/motion";

const STARS = [
  { top: "16%", left: "60%", size: 14 },
  { top: "30%", left: "82%", size: 10 },
  { top: "62%", left: "70%", size: 18 },
  { top: "22%", left: "92%", size: 12 },
  { top: "72%", left: "54%", size: 10 },
];

/**
 * Hero graffiti banner. Placeholder art (real "TWL8TE / World Tour" illustration
 * is a missing asset) — composed from graffiti.svg + a Sacco wordmark, with
 * scroll + mouse ParallaxLayers and idle float.
 */
export function HomeHero() {
  return (
    <Reveal>
      <div className="relative h-44 overflow-hidden border-2 border-black/20 bg-gradient-to-b from-[#e7a6ad] via-[#d8b394] to-[#c7b58f] lg:h-56">
        <div
          aria-hidden
          className="noise pointer-events-none absolute inset-0"
        />

        <ParallaxLayer
          speed={0.25}
          mouse
          mouseStrength={18}
          className="pointer-events-none absolute inset-0"
        >
          <Image
            src={Graffiti}
            alt=""
            aria-hidden
            className="absolute right-2 bottom-0 h-[120%] w-auto animate-float opacity-90"
          />
        </ParallaxLayer>

        <ParallaxLayer
          speed={-0.15}
          mouse
          mouseStrength={28}
          className="pointer-events-none absolute inset-0"
        >
          {STARS.map((s) => (
            <StarIcon
              key={`${s.top}-${s.left}`}
              weight="fill"
              className="absolute animate-float text-yellow drop-shadow"
              style={
                {
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                } as CSSProperties
              }
            />
          ))}
        </ParallaxLayer>

        <div className="relative z-10 flex h-full flex-col justify-center px-6 lg:px-10">
          <h1 className="font-sacco text-6xl text-black/85 uppercase leading-none tracking-tight lg:text-7xl">
            TWL8TE
          </h1>
          <span className="mt-1 font-sacco text-black/70 text-sm uppercase tracking-[0.35em]">
            World Tour
          </span>
        </div>
      </div>
    </Reveal>
  );
}
