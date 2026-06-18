import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./user";

// --- Market (nihad-owned) -----------------------------------------------------
// Peer economy: one shop per user, listings priced in shards, gifting + buying,
// and an append-only shard_transfer ledger. Every shard movement is zero-sum and
// uses the same race-safe atomic debit as the Shop (see apps/backend/src/shop).

export const userShopItemStatusEnum = pgEnum("user_shop_item_status", [
  "active",
  "sold",
  "inactive",
]);

export const shardTransferTypeEnum = pgEnum("shard_transfer_type", [
  "gift",
  "market_purchase",
]);

export const userShop = pgTable("user_shop", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  // One shop per user (UNIQUE — enforced at the DB level too).
  owner: integer("owner")
    .notNull()
    .unique()
    .references(() => account.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

export const userShopItem = pgTable("user_shop_item", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  shop: integer("shop")
    .notNull()
    .references(() => userShop.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  priceShards: integer("price_shards").notNull(),
  status: userShopItemStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

export const shardTransfer = pgTable("shard_transfer", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  fromUser: integer("from_user")
    .notNull()
    .references(() => account.id),
  toUser: integer("to_user")
    .notNull()
    .references(() => account.id),
  amount: integer("amount").notNull(),
  type: shardTransferTypeEnum("type").notNull(),
  note: text("note"),
  // Set for market_purchase rows; null for gifts.
  userShopItemId: integer("user_shop_item_id").references(() => userShopItem.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
