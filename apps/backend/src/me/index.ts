import { zValidator } from "@hono/zod-validator";
import { db, desc, eq, inArray, or } from "@realityware/database";
import { achievement } from "@realityware/database/schema/achievement";
import { city } from "@realityware/database/schema/city";
import {
  shardTransfer,
  userShopItem,
} from "@realityware/database/schema/market";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

// Participant dashboard: profile (account + achievements) and shard ledger.
export const meRouter = HonoApp()
  .get("/profile", authMiddleware(), async (c) => {
    // Strip the session off the account before sending it to the client.
    const { session: _session, ...account } = c.get("account");

    const achievements = await db
      .select()
      .from(achievement)
      .where(eq(achievement.userId, account.id));

    // Resolve the participant's city name (for /profile + the city gate).
    const cityRow = account.cityId
      ? await db
          .select({ name: city.name })
          .from(city)
          .where(eq(city.id, account.cityId))
          .then((r) => r[0])
      : null;

    return c.json({
      success: true,
      account,
      cityName: cityRow?.name ?? null,
      achievements,
    });
  })
  // Set the participant's city (must be one of the seeded cities).
  .post(
    "/city",
    authMiddleware(),
    zValidator("json", z.object({ cityId: z.number().int().positive() })),
    async (c) => {
      const acc = c.get("account");
      const { cityId } = c.req.valid("json");

      const target = await db
        .select({ id: city.id, name: city.name })
        .from(city)
        .where(eq(city.id, cityId))
        .then((r) => r[0]);
      if (!target) {
        return c.json({ success: false, message: "city-not-found" } as const);
      }

      await db
        .update(account)
        .set({ cityId: target.id })
        .where(eq(account.id, acc.id));

      return c.json({ success: true, cityId: target.id, cityName: target.name });
    },
  )
  // The caller's shard_transfer ledger (sent + received), newest first.
  .get("/transactions", authMiddleware(), async (c) => {
    const acc = c.get("account");

    const transfers = await db
      .select({
        id: shardTransfer.id,
        fromUser: shardTransfer.fromUser,
        toUser: shardTransfer.toUser,
        amount: shardTransfer.amount,
        type: shardTransfer.type,
        note: shardTransfer.note,
        createdAt: shardTransfer.createdAt,
        itemTitle: userShopItem.title,
      })
      .from(shardTransfer)
      .leftJoin(userShopItem, eq(userShopItem.id, shardTransfer.userShopItemId))
      .where(
        or(eq(shardTransfer.fromUser, acc.id), eq(shardTransfer.toUser, acc.id)),
      )
      .orderBy(desc(shardTransfer.createdAt));

    // Resolve counterparty display names in one extra query.
    const ids = [...new Set(transfers.flatMap((t) => [t.fromUser, t.toUser]))];
    const names = ids.length
      ? await db
          .select({ id: account.id, name: account.displayName })
          .from(account)
          .where(inArray(account.id, ids))
      : [];
    const nameMap = new Map(names.map((n) => [n.id, n.name]));

    const transactions = transfers.map((t) => ({
      ...t,
      fromName: nameMap.get(t.fromUser) ?? "Unknown",
      toName: nameMap.get(t.toUser) ?? "Unknown",
    }));

    return c.json({ success: true, meId: acc.id, transactions });
  });
