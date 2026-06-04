import {
  AddressBookTabsIcon,
  BarcodeIcon,
  BooksIcon,
  CakeIcon,
  type Icon,
  MoneyWavyIcon,
  PaperPlaneIcon,
  PresentationChartIcon,
  ShippingContainerIcon,
  TerminalWindowIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { userPermissionEnum } from "@realityware/database/schema/user";

export type NavSection = {
  title: string;
  permissions?: (typeof userPermissionEnum.enumValues)[number][];
  links: NavLink[];
};
export type NavLink = {
  title: string;
  url: string;
  icon?: Icon;
};

export const adminNav: NavSection = {
  title: "Admin",
  permissions: ["admin"],
  links: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: PresentationChartIcon,
    },
    {
      title: "Users",
      url: "/admin/users/*",
      icon: UsersIcon,
    },
    {
      title: "Projects",
      url: "/admin/projects/*",
      icon: BooksIcon,
    },
    {
      title: "Shop",
      url: "/admin/shop/*",
      icon: MoneyWavyIcon,
    },
    {
      title: "Community Events",
      url: "/admin/events/*",
      icon: CakeIcon,
    },
    {
      title: "Audit Logs",
      url: "/admin/audit-log/*",
      icon: TerminalWindowIcon,
    },
  ],
};

export const reviewerNav: NavSection = {
  title: "Reviewer",
  permissions: ["admin", "reviewer"],
  links: [
    {
      title: "Dashboard",
      url: "/admin/reviewer",
      icon: AddressBookTabsIcon,
    },
    {
      title: "Submissions",
      url: "/admin/reviewer/submissions/*",
      icon: PaperPlaneIcon,
    },
  ],
};

export const fulfillmentNav: NavSection = {
  title: "Fulfillment",
  permissions: ["admin", "fulfillment"],
  links: [
    {
      title: "Dashboard",
      url: "/admin/fulfillment",
      icon: BarcodeIcon,
    },
    {
      title: "Orders",
      url: "/admin/fulfillment/orders/*",
      icon: ShippingContainerIcon,
    },
  ],
};

export const navs = [adminNav, reviewerNav, fulfillmentNav];
