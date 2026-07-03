import {
  BooksIcon,
  CompassIcon,
  HandshakeIcon,
  HouseIcon,
  type Icon,
  RankingIcon,
  StorefrontIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import type { Route } from "next";

export type NavItem = {
  label: string;
  href: Route;
  /** `matchPathname` pattern for active detection (`"/"` is exact). */
  match: string;
  Icon: Icon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "home", href: "/", match: "/", Icon: HouseIcon },
  {
    label: "bounties",
    href: "/bounties",
    match: "/bounties/*",
    Icon: TargetIcon,
  },
  {
    label: "explores",
    href: "/explores",
    match: "/explores/*",
    Icon: CompassIcon,
  },
  { label: "shop", href: "/shop", match: "/shop/*", Icon: StorefrontIcon },
  {
    label: "market",
    href: "/market",
    match: "/market/*",
    Icon: HandshakeIcon,
  },
  { label: "guides", href: "/guides", match: "/guides/*", Icon: BooksIcon },
  {
    label: "leaderboard",
    href: "/leaderboard",
    match: "/leaderboard/*",
    Icon: RankingIcon,
  },
];
