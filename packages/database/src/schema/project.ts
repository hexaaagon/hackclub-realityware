import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

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
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  type: projectTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  codeUrl: text("code_url").notNull(),
  playableUrl: text("playable_url").notNull(),
  imageUrl: text("image_url").notNull(),
}).enableRLS();

export const shippedProjectStatusEnum = pgEnum("shipped_project_status", [
  "shipped",
  "reviewed",
  "changes-needed",
  "permanently-rejected",
  "approved",
]);
export const shippedProject = pgTable("shipped_project", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => project.id),
  shippedAt: text("shipped_at").notNull(),
  status: shippedProjectStatusEnum("status").notNull().default("shipped"),
  comment: text("comment"),
}).enableRLS();
