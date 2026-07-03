import { zValidator } from "@hono/zod-validator";
import { and, db, eq, gte, ilike, sql } from "@realityware/database";
import {
  shardTransfer,
  userShop,
  userShopItem,
} from "@realityware/database/schema/market";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

const itemInput = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  imageUrl: z.url().optional(),
  priceShards: z.number().int().positive(),
});

export const marketRouter = HonoApp()
  // All shops with owner + their active listings (powers the Browse grid).
  .get("/shops", authMiddleware(), async (c) => {
    const shops = await db
      .select({
        id: userShop.id,
        owner: userShop.owner,
        name: userShop.name,
        description: userShop.description,
        createdAt: userShop.createdAt,
        ownerName: account.displayName,
        ownerAvatar: account.avatar,
      })
      .from(userShop)
      .innerJoin(account, eq(account.id, userShop.owner));

    const items = await db
      .select()
      .from(userShopItem)
      .where(eq(userShopItem.status, "active"));

    const byShop = new Map<number, typeof items>();
    for (const it of items) {
      const arr = byShop.get(it.shop) ?? [];
      arr.push(it);
      byShop.set(it.shop, arr);
    }

    return c.json({
      success: true,
      shops: shops.map((s) => ({ ...s, items: byShop.get(s.id) ?? [] })),
    });
  })

  // The caller's own shop + all of its items (any status), for management.
  .get("/my-shop", authMiddleware(), async (c) => {
    const acc = c.get("account");
    const shop = await db
      .select()
      .from(userShop)
      .where(eq(userShop.owner, acc.id))
      .then((r) => r[0]);

    if (!shop) return c.json({ success: true, shop: null, items: [] });

    const items = await db
      .select()
      .from(userShopItem)
      .where(eq(userShopItem.shop, shop.id));

    return c.json({ success: true, shop, items });
  })

  // A single shop + its non-inactive items.
  .get(
    "/shops/:id",
    authMiddleware(),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const shop = await db
        .select({
          id: userShop.id,
          owner: userShop.owner,
          name: userShop.name,
          description: userShop.description,
          createdAt: userShop.createdAt,
          ownerName: account.displayName,
          ownerAvatar: account.avatar,
        })
        .from(userShop)
        .innerJoin(account, eq(account.id, userShop.owner))
        .where(eq(userShop.id, id))
        .then((r) => r[0]);

      if (!shop) return c.json({ success: false, message: "shop-not-found" });

      const items = await db
        .select()
        .from(userShopItem)
        .where(eq(userShopItem.shop, id));

      return c.json({ success: true, shop, items });
    },
  )

  // Create or update the caller's shop (one per user, enforced by UNIQUE owner).
  .post(
    "/shop",
    authMiddleware(),
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(80),
        description: z.string().min(1).max(2000),
      }),
    ),
    async (c) => {
      const acc = c.get("account");
      const { name, description } = c.req.valid("json");

      const existing = await db
        .select()
        .from(userShop)
        .where(eq(userShop.owner, acc.id))
        .then((r) => r[0]);

      const [shop] = existing
        ? await db
            .update(userShop)
            .set({ name, description })
            .where(eq(userShop.owner, acc.id))
            .returning()
        : await db
            .insert(userShop)
            .values({ owner: acc.id, name, description })
            .returning();

      return c.json({ success: true, shop });
    },
  )

  // Add a listing to the caller's shop.
  .post("/items", authMiddleware(), zValidator("json", itemInput), async (c) => {
    const acc = c.get("account");
    const data = c.req.valid("json");

    const shop = await db
      .select()
      .from(userShop)
      .where(eq(userShop.owner, acc.id))
      .then((r) => r[0]);
    if (!shop) return c.json({ success: false, message: "no-shop" });

    const [item] = await db
      .insert(userShopItem)
      .values({
        shop: shop.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? null,
        priceShards: data.priceShards,
      })
      .returning();

    return c.json({ success: true, item });
  })

  // Edit a listing (owner only).
  .patch(
    "/items/:id",
    authMiddleware(),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    zValidator(
      "json",
      itemInput
        .partial()
        .extend({
          status: z.enum(["active", "inactive"]).optional(),
        }),
    ),
    async (c) => {
      const acc = c.get("account");
      const { id } = c.req.valid("param");
      const patch = c.req.valid("json");

      const owned = await ownedItem(id, acc.id);
      if (!owned) return c.json({ success: false, message: "not-found" });

      const [item] = await db
        .update(userShopItem)
        .set({
          ...(patch.title !== undefined ? { title: patch.title } : {}),
          ...(patch.description !== undefined
            ? { description: patch.description }
            : {}),
          ...(patch.imageUrl !== undefined
            ? { imageUrl: patch.imageUrl }
            : {}),
          ...(patch.priceShards !== undefined
            ? { priceShards: patch.priceShards }
            : {}),
          ...(patch.status !== undefined ? { status: patch.status } : {}),
        })
        .where(eq(userShopItem.id, id))
        .returning();

      return c.json({ success: true, item });
    },
  )

  // Deactivate a listing (owner only; soft-delete).
  .delete(
    "/items/:id",
    authMiddleware(),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const acc = c.get("account");
      const { id } = c.req.valid("param");

      const owned = await ownedItem(id, acc.id);
      if (!owned) return c.json({ success: false, message: "not-found" });

      const [item] = await db
        .update(userShopItem)
        .set({ status: "inactive" })
        .where(eq(userShopItem.id, id))
        .returning();

      return c.json({ success: true, item });
    },
  )

  // Buy a listing — one atomic, zero-sum, race-safe transaction.
  .post(
    "/items/:id/buy",
    authMiddleware(),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const acc = c.get("account");
      const { id } = c.req.valid("param");

      const row = await db
        .select({ item: userShopItem, ownerId: userShop.owner })
        .from(userShopItem)
        .innerJoin(userShop, eq(userShop.id, userShopItem.shop))
        .where(eq(userShopItem.id, id))
        .then((r) => r[0]);

      if (!row) return c.json({ success: false, message: "item-not-found" });
      if (row.item.status !== "active") {
        return c.json({ success: false, message: "item-unavailable" });
      }
      if (row.ownerId === acc.id) {
        return c.json({ success: false, message: "cannot-buy-own" });
      }
      const price = row.item.priceShards;

      const result = await db
        .transaction(async (tx) => {
          // Debit buyer — race-safe, can never go negative.
          const [debited] = await tx
            .update(account)
            .set({ shards: sql`${account.shards} - ${price}` })
            .where(and(eq(account.id, acc.id), gte(account.shards, price)))
            .returning({ shards: account.shards });
          if (!debited) return { error: "insufficient-shards" as const };

          // Claim the item — only if still active (guards double-buy).
          const [sold] = await tx
            .update(userShopItem)
            .set({ status: "sold" })
            .where(
              and(eq(userShopItem.id, id), eq(userShopItem.status, "active")),
            )
            .returning({ id: userShopItem.id });
          if (!sold) throw new Error("__UNAVAILABLE__");

          // Credit seller (exact same amount — zero-sum).
          await tx
            .update(account)
            .set({ shards: sql`${account.shards} + ${price}` })
            .where(eq(account.id, row.ownerId));

          const [transfer] = await tx
            .insert(shardTransfer)
            .values({
              fromUser: acc.id,
              toUser: row.ownerId,
              amount: price,
              type: "market_purchase",
              userShopItemId: id,
            })
            .returning();

          return { shards: debited.shards, transfer };
        })
        .catch((e) => {
          if (e instanceof Error && e.message === "__UNAVAILABLE__") {
            return { error: "item-unavailable" as const };
          }
          throw e;
        });

      if ("error" in result) {
        return c.json({ success: false, message: result.error });
      }
      return c.json({
        success: true,
        shards: result.shards,
        transfer: result.transfer,
      });
    },
  )

  // Gift shards to another participant — atomic, zero-sum, race-safe.
  .post(
    "/gift",
    authMiddleware(),
    zValidator(
      "json",
      z.object({
        toUser: z.string().min(1),
        amount: z.number().int().positive(),
        note: z.string().max(500).optional(),
      }),
    ),
    async (c) => {
      const acc = c.get("account");
      const { toUser, amount, note } = c.req.valid("json");

      // Resolve recipient: exact slackId first, then case-insensitive name.
      let matches = await db
        .select()
        .from(account)
        .where(eq(account.slackId, toUser));
      if (matches.length === 0) {
        matches = await db
          .select()
          .from(account)
          .where(ilike(account.displayName, toUser));
      }
      if (matches.length === 0) {
        return c.json({ success: false, message: "recipient-not-found" });
      }
      if (matches.length > 1) {
        return c.json({ success: false, message: "ambiguous-recipient" });
      }
      const recipient = matches[0];
      if (!recipient) {
        return c.json({ success: false, message: "recipient-not-found" });
      }
      if (recipient.id === acc.id) {
        return c.json({ success: false, message: "cannot-gift-self" });
      }

      const result = await db.transaction(async (tx) => {
        const [debited] = await tx
          .update(account)
          .set({ shards: sql`${account.shards} - ${amount}` })
          .where(and(eq(account.id, acc.id), gte(account.shards, amount)))
          .returning({ shards: account.shards });
        if (!debited) return { error: "insufficient-shards" as const };

        await tx
          .update(account)
          .set({ shards: sql`${account.shards} + ${amount}` })
          .where(eq(account.id, recipient.id));

        const [transfer] = await tx
          .insert(shardTransfer)
          .values({
            fromUser: acc.id,
            toUser: recipient.id,
            amount,
            type: "gift",
            note: note ?? null,
          })
          .returning();

        return { shards: debited.shards, transfer };
      });

      if ("error" in result) {
        return c.json({ success: false, message: result.error });
      }
      return c.json({
        success: true,
        shards: result.shards,
        transfer: result.transfer,
        recipient: recipient.displayName,
      });
    },
  );

/** Returns the item if it belongs to a shop owned by `accountId`, else null. */
async function ownedItem(itemId: number, accountId: number) {
  return db
    .select({ id: userShopItem.id })
    .from(userShopItem)
    .innerJoin(userShop, eq(userShop.id, userShopItem.shop))
    .where(and(eq(userShopItem.id, itemId), eq(userShop.owner, accountId)))
    .then((r) => r[0] ?? null);
}
