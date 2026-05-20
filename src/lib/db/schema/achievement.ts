import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const achievement = pgTable("achievement", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
});
