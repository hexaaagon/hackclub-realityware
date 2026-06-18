import { zValidator } from "@hono/zod-validator";
import { and, db, eq, gte, sql } from "@realityware/database";
import {
  item,
  itemCategoryEnum,
  shopOrder,
} from "@realityware/database/schema/shop";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

// shop_item.cost is an 8-tuple in this region order.
export const SHOP_REGIONS = [
  "NA",
  "SA",
  "EU",
  "Asia",
  "India",
  "Oceania",
  "Africa",
  "ME",
] as const;

export const shopRouter = HonoApp()
  // The shop catalog. hexaa's user_account has no region/city column yet, so we
  // return the full per-region cost tuple + a default region index; the per-user
  // price resolves on the client once a region/city lands in the schema.
  .get(
    "/items",
    authMiddleware(),
    zValidator(
      "query",
      z.object({ category: z.enum(itemCategoryEnum.enumValues).optional() }),
    ),
    async (c) => {
      const { category } = c.req.valid("query");

      const items = category
        ? await db.select().from(item).where(eq(item.category, category))
        : await db.select().from(item);

      return c.json({
        success: true,
        regions: SHOP_REGIONS,
        defaultRegion: 0,
        items,
      });
    },
  )
  // Redeem/buy an item. Price is always re-resolved server-side, the balance is
  // checked + debited atomically (can never go negative), and an order row is
  // created for fulfillment — all in one transaction.
  .post(
    "/purchase",
    authMiddleware(),
    zValidator(
      "json",
      z.object({
        itemId: z.number().int().positive(),
        region: z
          .number()
          .int()
          .min(0)
          .max(SHOP_REGIONS.length - 1),
      }),
    ),
    async (c) => {
      const acc = c.get("account");
      const { itemId, region } = c.req.valid("json");

      const target = await db
        .select()
        .from(item)
        .where(eq(item.id, itemId))
        .then((rows) => rows[0]);

      if (!target) {
        return c.json({ success: false, message: "item-not-found" } as const);
      }

      // Never trust a client-sent amount — the price comes from the DB row.
      const cost = target.cost[region];
      if (typeof cost !== "number") {
        return c.json({ success: false, message: "invalid-region" } as const);
      }

      const result = await db.transaction(async (tx) => {
        // Atomic + race-safe: the WHERE guards `shards >= cost`, so concurrent
        // purchases can never drive the balance negative. No matching row ⇒
        // insufficient funds.
        const [debited] = await tx
          .update(account)
          .set({ shards: sql`${account.shards} - ${cost}` })
          .where(and(eq(account.id, acc.id), gte(account.shards, cost)))
          .returning({ shards: account.shards });

        if (!debited) return null;

        const [order] = await tx
          .insert(shopOrder)
          .values({
            userId: acc.id,
            itemId: target.id,
            region,
            shardCost: cost,
          })
          .returning();

        return { shards: debited.shards, order };
      });

      if (!result) {
        return c.json({
          success: false,
          message: "insufficient-shards",
        } as const);
      }

      return c.json({
        success: true,
        shards: result.shards,
        order: result.order,
      } as const);
    },
  );
