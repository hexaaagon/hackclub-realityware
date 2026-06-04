export type Bread = BreadStatic | BreadDynamic;
export type BreadStatic = {
  type: "static";
  title: string;
  url: string;
};
export type BreadDynamic = {
  type: "dynamic";
  title: (params: string[]) => string;
  url: string;
};

export const adminCrumbs: Bread[] = [
  // Admin Dashboard
  {
    type: "static",
    title: "Admin",
    url: "/admin",
  },

  // Users
  {
    type: "static",
    title: "Users",
    url: "/admin/users",
  },
  {
    type: "dynamic",
    title: (params) => `${params[0]}`,
    url: "/admin/users/*",
  },
  {
    type: "static",
    title: "Overview",
    url: "/admin/users/*/overview",
  },
  {
    type: "static",
    title: "Audit Log",
    url: "/admin/users/*/audit-log",
  },

  // Projects
  {
    type: "static",
    title: "Projects",
    url: "/admin/projects",
  },
  {
    type: "dynamic",
    title: (params) => `${params[0]}`,
    url: "/admin/projects/*",
  },
  {
    type: "static",
    title: "Overview",
    url: "/admin/projects/*/overview",
  },
  {
    type: "static",
    title: "Audit Log",
    url: "/admin/projects/*/audit-log",
  },

  // Shop
  {
    type: "static",
    title: "Shop",
    url: "/admin/shop",
  },
  {
    type: "dynamic",
    title: (params) => `${params[0]}`,
    url: "/admin/shop/*",
  },
  {
    type: "static",
    title: "Overview",
    url: "/admin/shop/*/overview",
  },
  {
    type: "static",
    title: "Audit Log",
    url: "/admin/shop/*/audit-log",
  },

  // Community Events
  {
    type: "static",
    title: "Community Events",
    url: "/admin/community-events",
  },
  {
    type: "dynamic",
    title: (params) => `${params[0]}`,
    url: "/admin/community-events/*",
  },
  {
    type: "static",
    title: "Overview",
    url: "/admin/community-events/*/overview",
  },
  {
    type: "static",
    title: "Attendees",
    url: "/admin/community-events/*/attendees",
  },
  {
    type: "static",
    title: "Edit",
    url: "/admin/community-events/*/edit",
  },
  {
    type: "static",
    title: "Audit Log",
    url: "/admin/community-events/*/audit-log",
  },

  // Audit Logs
  {
    type: "static",
    title: "Audit Logs",
    url: "/admin/audit-logs",
  },
  {
    type: "dynamic",
    title: (params) => `${params[0]}`,
    url: "/admin/audit-logs/*",
  },
];
