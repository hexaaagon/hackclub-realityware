"use client";

import {
  ArrowClockwiseIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CoinsIcon,
  CopyIcon,
  MapPinIcon,
  MedalIcon,
  ReceiptIcon,
  SignInIcon,
  TrophyIcon,
} from "@phosphor-icons/react";
import { cn } from "@realityware/util";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Graffiti from "#/images/graffiti.svg";
import {
  CountUp,
  ParallaxLayer,
  Reveal,
  ShardBurst,
  type ShardBurstHandle,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useTransactions } from "@/hooks/use-transactions";
import { CityPicker } from "../../_components/city-picker";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatJoined(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(d);
}

export function ProfileClient() {
  const { profile, isLoading, error, mutate } = useProfile();
  const burstRef = useRef<ShardBurstHandle>(null);
  const [cityOpen, setCityOpen] = useState(false);

  if (error) {
    return (
      <ProfileMessage
        title="Couldn't load your profile"
        description="Lorem ipsum dolor sit amet — something went wrong."
        action={
          <Button
            type="button"
            onClick={() => mutate()}
            className="rounded-xs border-2 border-black/20 bg-orange text-black hover:bg-orange/85"
          >
            <ArrowClockwiseIcon className="size-4" />
            Try again
          </Button>
        }
      />
    );
  }

  if (isLoading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <ProfileMessage
        icon={<SignInIcon className="size-5" />}
        title="You're not signed in"
        description="Lorem ipsum dolor sit amet — sign in to see your shards and achievements."
      />
    );
  }

  const { account, achievements } = profile;
  const roles = account.role ?? ["member"];

  async function copyHandle() {
    try {
      await navigator.clipboard.writeText(account.slackId);
      toast.success("Slack ID copied!");
    } catch {
      toast.error("Couldn't copy.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <Reveal>
        <section className="noise relative overflow-hidden border-2 border-black/20 bg-gradient-to-r from-orange/15 via-card to-blue/10">
          <ParallaxLayer
            mouse
            speed={0.2}
            className="pointer-events-none absolute -right-4 -bottom-10 z-0"
          >
            <Image
              src={Graffiti}
              alt=""
              aria-hidden
              className="h-44 w-auto opacity-30"
            />
          </ParallaxLayer>
          <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 rounded-none border-2 border-black/20">
              <AvatarImage src={account.avatar} alt={account.displayName} />
              <AvatarFallback className="rounded-none bg-orange/15 font-sacco text-lg">
                {initials(account.displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h1 className="font-sacco text-2xl uppercase leading-none sm:text-3xl">
                {account.displayName}
              </h1>
              <button
                type="button"
                onClick={copyHandle}
                className="group inline-flex w-fit items-center gap-1.5 rounded-xs text-black/55 text-sm outline-none transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-orange"
              >
                <span className="font-mono">@{account.slackId}</span>
                <CopyIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {roles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="rounded-xs border-2 border-black/20 font-sacco uppercase"
                  >
                    {role}
                  </Badge>
                ))}
                <button
                  type="button"
                  onClick={() => setCityOpen(true)}
                  className="inline-flex items-center gap-1 rounded-xs border-2 border-black/20 bg-card px-2 py-0.5 font-sacco text-xs uppercase outline-none transition-colors hover:border-black/40 focus-visible:ring-2 focus-visible:ring-orange"
                >
                  <MapPinIcon weight="fill" className="size-3.5 text-orange" />
                  {profile.cityName ?? "choose city"}
                  <span className="text-black/40">· change</span>
                </button>
              </div>
            </div>

            {/* Shards — click for a celebratory burst */}
            <button
              type="button"
              onClick={() => burstRef.current?.fire()}
              aria-label="Celebrate your shards balance"
              className="relative flex shrink-0 items-center gap-2 border-2 border-black/20 bg-card px-4 py-3 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-orange active:scale-95"
            >
              <ShardBurst ref={burstRef} />
              <CoinsIcon weight="fill" className="size-6 text-orange" />
              <span className="flex flex-col items-start leading-none">
                <CountUp
                  value={account.shards}
                  animateOnMount
                  className="font-sacco text-2xl tabular-nums"
                />
                <span className="mt-1 text-black/50 text-xs uppercase">
                  shards
                </span>
              </span>
            </button>
          </div>
        </section>
      </Reveal>

      {/* Stats */}
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4" amount="some">
        <StatCard
          label="Shards"
          value={account.shards}
          icon={<CoinsIcon weight="fill" className="size-4 text-orange" />}
        />
        <StatCard
          label="Achievements"
          value={achievements.length}
          icon={<TrophyIcon weight="fill" className="size-4 text-green" />}
        />
        <StatCard
          label="Week"
          value={3}
          suffix=" / 12"
          icon={<MedalIcon weight="fill" className="size-4 text-dark-blue" />}
        />
        <StatCard
          label="Member since"
          text={formatJoined(account.createdAt)}
          icon={<MedalIcon className="size-4 text-black/40" />}
        />
      </Stagger>

      {/* Achievements */}
      <Reveal className="flex items-center gap-2">
        <h2 className="font-sacco text-xl uppercase">Achievements</h2>
        <span className="border-2 border-black/20 bg-card px-2 py-0.5 font-mono text-black/60 text-xs">
          {achievements.length}
        </span>
      </Reveal>

      {achievements.length === 0 ? (
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
              No achievements yet
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum dolor sit amet — ship projects and bounties to earn
              badges.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Stagger
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          amount="some"
        >
          {achievements.map((a) => (
            <StaggerItem key={a.id} className="h-full">
              <Tilt className="block h-full">
                <div className="flex h-full items-start gap-3 border-2 border-black/20 bg-card p-3">
                  <div className="grid size-12 shrink-0 place-items-center border-2 border-black/20 bg-muted">
                    {a.iconUrl ? (
                      // biome-ignore lint/performance/noImgElement: remote badge URLs, no domain allowlist
                      <img
                        src={a.iconUrl}
                        alt=""
                        className="size-8 object-contain"
                      />
                    ) : (
                      <TrophyIcon
                        weight="fill"
                        className="size-6 text-orange"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <h3 className="font-medium text-sm leading-tight">
                      {a.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-black/50 text-xs">
                      {a.description}
                    </p>
                  </div>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <TransactionsSection />

      <CityPicker
        open={cityOpen}
        onOpenChange={setCityOpen}
        currentCityId={account.cityId}
        onChanged={() => mutate()}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  text,
  suffix,
  icon,
}: {
  label: string;
  value?: number;
  text?: string;
  suffix?: string;
  icon: React.ReactNode;
}) {
  return (
    <StaggerItem className="h-full">
      <Tilt className="block h-full">
        <div className="flex h-full flex-col gap-1 border-2 border-black/20 bg-card p-3">
          <span className="inline-flex items-center gap-1.5 text-black/50 text-xs uppercase">
            {icon}
            {label}
          </span>
          {text !== undefined ? (
            <span className="font-sacco text-2xl">{text}</span>
          ) : (
            <span className="font-sacco text-2xl">
              <CountUp
                value={value ?? 0}
                animateOnMount
                className="tabular-nums"
              />
              {suffix && <span className="text-black/40">{suffix}</span>}
            </span>
          )}
        </div>
      </Tilt>
    </StaggerItem>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-32 rounded-none border-2 border-black/20" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-20 rounded-none border-2 border-black/20"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-20 rounded-none border-2 border-black/20"
          />
        ))}
      </div>
    </div>
  );
}

function ProfileMessage({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Empty className={cn("border-2 border-black/20 bg-card")}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle className="font-sacco text-base uppercase">
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action}
    </Empty>
  );
}

/** Shard ledger: gifts sent/received + market purchases. */
function TransactionsSection() {
  const { transactions, meId, isLoading } = useTransactions();

  return (
    <>
      <Reveal className="flex items-center gap-2">
        <h2 className="font-sacco text-xl uppercase">Transactions</h2>
        <span className="border-2 border-black/20 bg-card px-2 py-0.5 font-mono text-black/60 text-xs">
          {transactions.length}
        </span>
      </Reveal>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-14 rounded-none border-2 border-black/20"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Empty className="border-2 border-black/20 bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-sacco text-base uppercase">
              No transactions yet
            </EmptyTitle>
            <EmptyDescription>
              Lorem ipsum — gifts and market trades show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Stagger className="flex flex-col gap-2" amount="some">
          {transactions.map((t) => {
            const incoming = t.toUser === meId;
            const counterparty = incoming ? t.fromName : t.toName;
            const label =
              t.type === "gift"
                ? incoming
                  ? `Gift from ${counterparty}`
                  : `Gift to ${counterparty}`
                : incoming
                  ? `Sold ${t.itemTitle ?? "item"} to ${counterparty}`
                  : `Bought ${t.itemTitle ?? "item"} from ${counterparty}`;
            return (
              <StaggerItem key={t.id}>
                <div className="flex items-center gap-3 border-2 border-black/20 bg-card p-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center border-2 border-black/20",
                      incoming ? "text-green" : "text-orange",
                    )}
                  >
                    {incoming ? (
                      <ArrowDownLeftIcon className="size-4" />
                    ) : (
                      <ArrowUpRightIcon className="size-4" />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-sm">
                      {label}
                    </span>
                    {t.note && (
                      <span className="truncate text-black/45 text-xs">
                        “{t.note}”
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 font-medium text-sm tabular-nums",
                      incoming ? "text-green" : "text-black/70",
                    )}
                  >
                    {incoming ? "+" : "−"}
                    {t.amount}
                    <CoinsIcon weight="fill" className="size-3.5 text-orange" />
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </>
  );
}
