import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export type UserPermission = (typeof userPermissionEnum.enumValues)[number];
export const userPermissionEnum = pgEnum("user_permissions", [
  "member",
  "reviewer",
  "fulfillment",
  "admin",
]);
export const account = pgTable("user_account", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  slackId: text("slack_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar").notNull(),
  email: text("email")
    .notNull()
    .unique()
    .references(() => user.email),
  permissions: userPermissionEnum("role").notNull().array().default(["member"]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  shards: integer("shards").notNull().default(0),
  // nihad-owned: which city the participant competes for (Leaderboard). The FK
  // to `city` is declared at the DB level (see manual_migrations/leaderboard.sql)
  // to avoid a circular import with schema/city.ts.
  cityId: integer("city_id"),
}).enableRLS();
