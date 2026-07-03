"use client";

import { ArrowClockwiseIcon, CoinsIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import Graffiti from "#/images/graffiti.svg";
import {
  AmbientParticles,
  CountUp,
  Marquee,
  ParallaxLayer,
  Reveal,
  type SlidingTabItem,
  SlidingTabs,
  Stagger,
  StaggerItem,
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
import { useProfile } from "@/hooks/use-profile";
import { useShopItems } from "@/hooks/use-shop";
import { RegionSelect } from "./region-select";
import { ShopCard } from "./shop-card";

type CategoryTab = "all" | "grants" | "items";

const CATEGORY_TABS: SlidingTabItem<CategoryTab>[] = [
  { id: "all", label: "all" },
  { id: "grants", label: "grants" },
  { id: "items", label: "items" },
];

const MARQUEE_TAGS = [
  "26 GREEN",
  "MADE BY TEENAGERS",
  "SPEND YOUR SHARDS",
  "REDEEM • BUILD • SHIP",
];

export function ShopClient() {
  const [tab, setTab] = useState<CategoryTab>("all");
  const [region, setRegion] = useState(0);

  const { items, isLoading, error, mutate } = useShopItems();
  const { profile, mutate: mutateProfile } = useProfile();
  const shards = profile?.account.shards ?? 0;

  const filtered = items.filter((it) =>
    tab === "all"
      ? true
      : tab === "grants"
        ? it.category === "grant"
        : it.category === "items",
  );

  const handlePurchased = useCallback(
    (newShards: number) => {
      // Reflect the debited balance immediately, then revalidate from the server.
      mutateProfile(
        (prev) =>
          prev?.success
            ? { ...prev, account: { ...prev.account, shards: newShards } }
            : prev,
        { revalidate: true },
      );
      mutate();
    },
    [mutate, mutateProfile],
  );

  return (
    <div className="flex flex-col gap-6">
      <ShopBanner />

      <Reveal className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-black/50 text-sm">categories:</span>
          <SlidingTabs
            items={CATEGORY_TABS}
            active={tab}
            onChange={setTab}
            layoutId="shop-categories"
            className="rounded-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border-2 border-black/20 bg-card px-2.5 py-1.5 text-sm">
            <CoinsIcon weight="fill" className="size-4 text-orange" />
            <CountUp
              value={shards}
              animateOnMount
              className="font-medium tabular-nums"
            />
            <span className="text-black/50">shards</span>
          </span>
          <RegionSelect value={region} onChange={setRegion} />
        </div>
      </Reveal>

      {error ? (
        <ShopError onRetry={() => mutate()} />
      ) : isLoading ? (
        <ShopGridSkeleton />
      ) : filtered.length === 0 ? (
        <ShopEmpty />
      ) : (
        <Stagger
          key={tab}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          amount="some"
        >
          {filtered.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <ShopCard
                item={item}
                region={region}
                balance={shards}
                onPurchased={handlePurchased}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

/** Graffiti banner with a ghosted placeholder quote + a flavor ticker. */
function ShopBanner() {
  return (
    <Reveal>
      <section className="noise relative overflow-hidden border-2 border-black/20 bg-gradient-to-r from-orange/15 via-card to-blue/10">
        <AmbientParticles />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden opacity-[0.06]"
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="whitespace-nowrap font-sacco text-5xl uppercase leading-[1.05]"
            >
              Accept the things in life that cannot be changed&nbsp;
            </span>
          ))}
        </div>
        <ParallaxLayer
          mouse
          speed={0.25}
          className="pointer-events-none absolute -right-4 -bottom-12 z-0"
        >
          <Image
            src={Graffiti}
            alt=""
            aria-hidden
            className="h-52 w-auto opacity-40"
          />
        </ParallaxLayer>

        <div className="relative z-10 flex min-h-[148px] flex-col justify-between gap-4 p-5">
          <div className="flex items-start justify-between">
            <span className="font-sacco text-xl uppercase">
              shop<span className="text-orange">=</span>
            </span>
            <span className="-rotate-3 border-2 border-black/20 bg-yellow px-2 py-0.5 font-sacco text-sm uppercase">
              ¥2.060
            </span>
          </div>
          <h1 className="max-w-lg font-sacco text-2xl uppercase leading-none sm:text-3xl">
            Lorem ipsum — spend your shards
          </h1>
        </div>

        <Marquee
          className="border-black/20 border-t-2 bg-card py-1.5 font-medium text-black/60 text-xs uppercase tracking-widest"
          speed={18}
        >
          {MARQUEE_TAGS.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-3">
              {tag}
              <span className="text-orange">•</span>
            </span>
          ))}
        </Marquee>
      </section>
    </Reveal>
  );
}

function ShopGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col border-2 border-black/20 bg-card">
          <Skeleton className="h-[152px] rounded-none border-black/20 border-b-2" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-4 w-2/3 rounded-xs" />
            <Skeleton className="h-3 w-1/3 rounded-xs" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-4 w-16 rounded-xs" />
              <Skeleton className="h-8 w-16 rounded-xs" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopEmpty() {
  return (
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
          Nothing in stock
        </EmptyTitle>
        <EmptyDescription>
          Lorem ipsum dolor sit amet — new grants and gear drop here soon.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ShopError({ onRetry }: { onRetry: () => void }) {
  return (
    <Empty className="border-2 border-black/20 bg-card">
      <EmptyHeader>
        <EmptyTitle className="font-sacco text-base uppercase">
          Couldn&apos;t load the shop
        </EmptyTitle>
        <EmptyDescription>
          Lorem ipsum dolor sit amet — something went wrong fetching the
          catalog.
        </EmptyDescription>
      </EmptyHeader>
      <Button
        type="button"
        onClick={onRetry}
        className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
      >
        <ArrowClockwiseIcon className="size-4" />
        Try again
      </Button>
    </Empty>
  );
}
