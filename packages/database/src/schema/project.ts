import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./user";

export const projectTypeEnum = pgEnum("project_type", [
  "software-web",
  "software-mobile",
  "software-windows",
  "software-mac",
  "software-linux",
  "software-cross",
  "hardware",
]);
export const project = pgTable("project", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  type: projectTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  codeUrl: text("code_url").notNull(),
  playableUrl: text("playable_url").notNull(),
  imageUrl: text("image_url").notNull(),
}).enableRLS();

export const shippedProjectStatusEnum = pgEnum("project_shipped_status_enum", [
  "shipped",
  "reviewed",
  "changes-needed",
  "permanently-rejected",
  "approved",
]);
export const shippedProject = pgTable("project_shipped_status", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => project.id),
  shippedAt: timestamp("shipped_at").defaultNow().notNull(),
  status: shippedProjectStatusEnum("status").notNull().default("shipped"),
  comment: text("comment"),
}).enableRLS();
