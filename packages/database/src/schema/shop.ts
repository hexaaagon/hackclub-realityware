import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./user";

export const itemCategoryEnum = pgEnum("shop_item_category", [
  "grant",
  "items",
]);
export const item = pgTable("shop_item", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  addedBy: integer("added_by")
    .notNull()
    .references(() => account.id),
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

export const shopOrderStatusEnum = pgEnum("shop_order_status", [
  "pending",
  "fulfilled",
  "cancelled",
]);
export const shopOrder = pgTable("shop_order", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id),
  region: integer("region").notNull(),
  shardCost: integer("shard_cost").notNull(),
  status: shopOrderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
