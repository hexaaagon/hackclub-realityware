import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const itemCategoryEnum = pgEnum("shop_item_category", [
  "grant",
  "items",
]);
export const item = pgTable("shop_item", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  addedBy: text("added_by")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: itemCategoryEnum("category").notNull(),
  cost: integer("cost")
    .array()
    .$type<
      [
        /**
         * @title North America
         */
        number,
        /**
         * @title South America
         */
        number,
        /**
         * @title Europe
         */
        number,
        /**
         * @title Asia
         */
        number,
        /**
         * @title India
         */
        number,
        /**
         * @title Oceania
         */
        number,
        /**
         * @title Africa
         */
        number,
        /**
         * @title Middle East
         */
        number,
      ]
    >()
    .notNull(),
}).enableRLS();
