import { integer, jsonb, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const userActionEnum = pgEnum("log-user-action", [
  "user-create",
  "user-edit",
  "project-draft",
  "project-delete",
  "project-ship",
]);
export const logUser = pgTable("log-user", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  action: userActionEnum().notNull(),
  data: jsonb(),
});

export const adminActionEnum = pgEnum("log-admin-action", [
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
export const logAdmin = pgTable("log-admin", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  action: adminActionEnum().notNull(),
  data: jsonb(),
});
