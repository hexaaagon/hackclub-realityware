import { integer, pgEnum, pgPolicy, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

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
  permissions: userPermissionEnum("role").notNull().array().default(["member"]),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  shards: integer("shards").notNull().default(0),
}).enableRLS();
