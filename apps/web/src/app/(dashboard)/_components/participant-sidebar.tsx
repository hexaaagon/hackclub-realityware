"use client";

import { CoinsIcon, SignOutIcon, StarIcon } from "@phosphor-icons/react";
import { authClient } from "@realityware/auth/client";
import { cn, matchPathname } from "@realityware/util";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RealitywareLogo from "#/images/realityware.svg";
import {
  CountUp,
  Reveal,
  SlidingPill,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DashboardData } from "../_data";
import { NAV_ITEMS } from "../_nav";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Shared sidebar body: brand → week → welcome+star → boxed nav → profile card.
 * Rendered both in the desktop rail and the mobile drawer (distinct `navLayoutId`
 * so their SlidingPill layout groups don't collide). `onNavigate` lets the mobile
 * drawer close itself on link click.
 */
export function SidebarInner({
  data,
  navLayoutId,
  onNavigate,
}: {
  data: DashboardData;
  navLayoutId: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { account, week } = data;

  async function handleSignOut() {
    await authClient.signOut();
    window.location.assign("/");
  }

  return (
    <>
      <Stagger className="flex flex-1 flex-col gap-5" amount="some">
        <StaggerItem>
          <Link href="/" className="inline-flex" onClick={onNavigate}>
            <Image
              src={RealitywareLogo}
              alt="Realityware home"
              className="h-7 w-auto"
              priority
            />
          </Link>
        </StaggerItem>

        <StaggerItem className="flex flex-col gap-1">
          <span className="font-sacco text-black/70 text-sm uppercase tracking-wide">
            Week {week} <span className="text-black/30">/ 12</span>
          </span>
          <span className="font-medium text-black text-lg leading-tight">
            Welcome back, {account.displayName}!
          </span>
          <span className="mt-1 inline-flex items-start gap-1.5 text-black/50 text-xs">
            <StarIcon
              weight="fill"
              className="mt-0.5 size-3.5 shrink-0 text-yellow"
            />
            Lorem ipsum dolor sit amet, consectetur elit.
          </span>
        </StaggerItem>

        <StaggerItem>
          <nav className="flex flex-col border-2 border-black/20 bg-card p-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.match === "/"
                  ? pathname === "/"
                  : matchPathname(item.match, pathname);
              const Icon = item.Icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-3 py-2 font-medium text-sm transition-colors",
                    "rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-orange",
                    active ? "text-black" : "text-black/55 hover:text-black",
                  )}
                >
                  {active && <SlidingPill layoutId={navLayoutId} />}
                  <Icon
                    weight={active ? "fill" : "regular"}
                    className="relative z-10 size-4 shrink-0 group-hover:animate-wiggle"
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </StaggerItem>
      </Stagger>

      <Reveal className="mt-auto">
        <Tilt className="block">
          <div className="noise flex items-center gap-2.5 border-2 border-black/20 bg-card p-2.5">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              <Avatar className="size-9 rounded-none border-2 border-black/20">
                <AvatarImage src={account.avatar} alt="" />
                <AvatarFallback className="rounded-none bg-orange/15 font-sacco text-xs">
                  {initials(account.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-sm">
                  {account.displayName}
                </span>
                <span className="inline-flex items-center gap-1 text-black/60 text-xs">
                  <CoinsIcon weight="fill" className="size-3.5 text-orange" />
                  <CountUp
                    value={account.shards}
                    animateOnMount
                    className="tabular-nums"
                  />
                  <span>shards</span>
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Log out"
              className="grid size-7 shrink-0 place-items-center rounded-xs border-2 border-transparent text-black/50 outline-none transition-colors hover:border-black/20 hover:text-black focus-visible:ring-2 focus-visible:ring-orange"
            >
              <SignOutIcon className="size-4" />
            </button>
          </div>
        </Tilt>
      </Reveal>
    </>
  );
}

/** Participant left rail (desktop only — mobile uses the drawer in MobileMenu). */
export function ParticipantSidebar({ data }: { data: DashboardData }) {
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col gap-5 border-black/20 border-r-2 bg-background p-4 lg:flex">
      <SidebarInner data={data} navLayoutId="participant-nav" />
    </aside>
  );
}
