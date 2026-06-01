import {
  AddressBookTabsIcon,
  BarcodeIcon,
  BooksIcon,
  CakeIcon,
  type Icon,
  MoneyWavyIcon,
  PresentationChartIcon,
  ShippingContainerIcon,
  TerminalWindowIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { PaperPlaneIcon } from "@phosphor-icons/react/dist/ssr";
import type { userPermissionEnum } from "@realityware/database/schema/user";

export type navSection = {
  title: string;
  permissions?: (typeof userPermissionEnum.enumValues)[number][];
  links: navLink[];
};
export type navLink = {
  title: string;
  url: string;
  strict?: boolean;
  icon?: Icon;
};

export const adminNav: navSection = {
  title: "Admin",
  permissions: ["admin"],
  links: [
    {
      title: "Dashboard",
      url: "/admin",
      strict: true,
      icon: PresentationChartIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: BooksIcon,
    },
    {
      title: "Shop",
      url: "/admin/shop",
      icon: MoneyWavyIcon,
    },
    {
      title: "Community Events",
      url: "/admin/events",
      icon: CakeIcon,
    },
    {
      title: "Audit Log",
      url: "/admin/audit-log",
      icon: TerminalWindowIcon,
    },
  ],
};

export const reviewerNav: navSection = {
  title: "Reviewer",
  permissions: ["admin", "reviewer"],
  links: [
    {
      title: "Dashboard",
      url: "/admin/reviewer",
      strict: true,
      icon: AddressBookTabsIcon,
    },
    {
      title: "Submissions",
      url: "/admin/reviewer/submissions",
      icon: PaperPlaneIcon,
    },
  ],
};

export const fulfillmentNav: navSection = {
  title: "Fulfillment",
  permissions: ["admin", "fulfillment"],
  links: [
    {
      title: "Dashboard",
      url: "/admin/fulfillment",
      strict: true,
      icon: BarcodeIcon,
    },
    {
      title: "Orders",
      url: "/admin/fulfillment/orders",
      icon: ShippingContainerIcon,
    },
  ],
};

export const navs = [adminNav, reviewerNav, fulfillmentNav];
