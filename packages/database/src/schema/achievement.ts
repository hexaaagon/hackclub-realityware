import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { account } from "./user";

export const achievement = pgTable("achievement", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
}).enableRLS();
