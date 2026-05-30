import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
  email: text("email")
    .notNull()
    .unique()
    .references(() => user.email),
  // displayName: text("displayName").notNull(),
  permissions: userPermissionEnum("role").notNull().array().default(["member"]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  shards: integer("shards").notNull().default(0),
}).enableRLS();
