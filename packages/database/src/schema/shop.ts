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

// --- PROPOSED (nihad): shop_order ---------------------------------------------
// Fulfillment is hexaa's domain, so this table is a proposal: the purchase route
// is built against it, but the DDL must be reviewed/applied by hexaa before it
// exists in the shared DB. Keep it minimal and matching the style above.
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
  // 0..7 index into SHOP_REGIONS [NA, SA, EU, Asia, India, Oceania, Africa, ME].
  region: integer("region").notNull(),
  // Snapshot of the shard price the user paid, resolved server-side at purchase.
  shardCost: integer("shard_cost").notNull(),
  status: shopOrderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
