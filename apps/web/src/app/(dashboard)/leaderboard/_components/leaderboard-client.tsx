"use client";

import {
  ArrowClockwiseIcon,
  ClockIcon,
  TrophyIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import Image from "next/image";
import Graffiti from "#/images/graffiti.svg";
import {
  AmbientParticles,
  CountUp,
  ParallaxLayer,
  Reveal,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { type CityRank, useLeaderboard } from "@/hooks/use-leaderboard";

// Rank chip colors — gold / silver / bronze for the podium, neutral otherwise.
function rankClass(rank: number) {
  if (rank === 1) return "bg-yellow text-black";
  if (rank === 2) return "bg-gray text-black";
  if (rank === 3) return "bg-orange text-black";
  return "bg-muted text-black/60";
}

export function LeaderboardClient() {
  const { cities, onlineToday, myCityId, isLoading, error, mutate } =
    useLeaderboard();

  const maxScore = cities.reduce((m, c) => Math.max(m, c.score), 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Reveal>
        <section className="noise relative flex flex-col gap-2 overflow-hidden border-2 border-black/20 bg-gradient-to-r from-dark-blue/15 via-card to-green/10 p-5">
          <AmbientParticles />
          <ParallaxLayer
            mouse
            speed={0.2}
            className="pointer-events-none absolute -right-4 -bottom-10 z-0"
          >
            <Image
              src={Graffiti}
              alt=""
              aria-hidden
              className="h-40 w-auto opacity-25"
            />
          </ParallaxLayer>
          <span className="relative z-10 font-sacco text-xl uppercase">
            leaderboard<span className="text-orange">=</span>
          </span>
          <h1 className="relative z-10 max-w-lg font-sacco text-2xl uppercase leading-none sm:text-3xl">
            Lorem ipsum — cities race
          </h1>
          <span className="relative z-10 mt-1 inline-flex w-fit items-center gap-2 border-2 border-black/20 bg-card px-2.5 py-1.5 text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green/70" />
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            <CountUp
              value={onlineToday}
              animateOnMount
              className="font-medium tabular-nums"
            />
            <span className="text-black/55">people coding today</span>
          </span>
        </section>
      </Reveal>

      {error ? (
        <Empty className="border-2 border-black/20 bg-card">
          <EmptyHeader>
            <EmptyTitle className="font-sacco text-base uppercase">
              Couldn&apos;t load the leaderboard
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum dolor sit amet — something went wrong.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            type="button"
            onClick={() => mutate()}
            className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
          >
            <ArrowClockwiseIcon className="size-4" />
            Try again
          </Button>
        </Empty>
      ) : isLoading ? (
        <LeaderboardSkeleton />
      ) : cities.length === 0 ? (
        <Empty className="border-2 border-black/20 bg-card">
          <EmptyHeader>
            <EmptyMedia>
              <Image
                src={Graffiti}
                alt=""
                aria-hidden
                className="h-24 w-auto animate-float opacity-60"
              />
            </EmptyMedia>
            <EmptyTitle className="font-sacco text-base uppercase">
              No cities yet
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum dolor sit amet — the race kicks off soon.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Stagger className="flex flex-col gap-3" amount="some">
          {cities.map((city) => (
            <StaggerItem key={city.id}>
              <CityRow
                city={city}
                maxScore={maxScore}
                isMine={city.id === myCityId}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function CityRow({
  city,
  maxScore,
  isMine,
}: {
  city: CityRank;
  maxScore: number;
  isMine: boolean;
}) {
  const pct = Math.max(4, Math.round((city.score / maxScore) * 100));
  return (
    <Tilt className="block" lift={2}>
      <div
        className={cn(
          "relative flex items-center gap-3 border-2 bg-card p-3",
          isMine ? "border-orange" : "border-black/20",
        )}
      >
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center border-2 border-black/20 font-sacco text-base",
            rankClass(city.rank),
          )}
        >
          {city.rank <= 3 ? (
            <TrophyIcon weight="fill" className="size-5" />
          ) : (
            city.rank
          )}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-sacco text-lg uppercase leading-none">
              {city.name}
            </h3>
            {isMine && (
              <span className="shrink-0 border-2 border-black/20 bg-orange px-1.5 py-0.5 font-sacco text-[10px] uppercase">
                you
              </span>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden border border-black/15 bg-muted">
            <div
              className="h-full bg-orange"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
          <div className="flex items-center gap-3 text-black/50 text-xs">
            <span className="inline-flex items-center gap-1">
              <UsersThreeIcon className="size-3.5" />
              {city.members} members
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {city.hours} h
            </span>
          </div>
        </div>

        <span className="flex shrink-0 flex-col items-end leading-none">
          <CountUp
            value={city.score}
            animateOnMount
            className="font-sacco text-2xl tabular-nums"
          />
          <span className="mt-1 text-black/45 text-xs uppercase">pts</span>
        </span>
      </div>
    </Tilt>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          className="h-20 rounded-none border-2 border-black/20"
        />
      ))}
    </div>
  );
}
