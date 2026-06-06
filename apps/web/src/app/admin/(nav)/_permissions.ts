import type { UserPermission } from "@realityware/database/schema/user";

export const adminPermissions: UserPermission[] = ["admin"] as const;

export const fulfillmentPermissions: UserPermission[] = [
  "admin",
  "fulfillment",
] as const;

export const reviewerPermissions: UserPermission[] = [
  "admin",
  "reviewer",
] as const;
