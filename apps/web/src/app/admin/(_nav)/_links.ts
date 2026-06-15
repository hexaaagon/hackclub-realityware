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
  SubwayIcon,
  TerminalWindowIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { UserPermission } from "@realityware/database/schema/user";
import {
  adminPermissions,
  fulfillmentPermissions,
  reviewerPermissions,
} from "./_permissions";

export type NavSection = {
  title: string;
  permissions?: UserPermission[];
  links: NavLink[];
};
export type NavLink = {
  title: string;
  url: string;
  icon?: Icon;
};

export const adminNav: NavSection = {
  title: "Admin",
  permissions: adminPermissions,
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

export const fulfillmentNav: NavSection = {
  title: "Fulfillment",
  permissions: fulfillmentPermissions,
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

export const reviewerNav: NavSection = {
  title: "Reviewer",
  permissions: reviewerPermissions,
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
    {
      title: "Hall Of Fame",
      url: "/admin/reviewer/hall-of-fame/*",
      icon: SubwayIcon,
    },
  ],
};

export const navs = [adminNav, fulfillmentNav, reviewerNav];
