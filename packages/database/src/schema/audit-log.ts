import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { account } from "./user";

export const userActionEnum = pgEnum("log_user_action", [
  "user-modify",
  "project-draft",
  "project-delete",
  "project-ship",
]);
export const logUser = pgTable("log_user", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  action: userActionEnum().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  data: jsonb(),
}).enableRLS();

export const adminActionEnum = pgEnum("log_admin_action", [
  "add-permissions",
  "modify-permissions",
  "remove-permissions",
  "add-event",
  "modify-event",
  "remove-event",
  "add-shop-item",
  "modify-shop-item",
  "remove-shop-item",
]);
export const logAdmin = pgTable("log_admin", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  action: adminActionEnum().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  data: jsonb(),
}).enableRLS();
