import { zValidator } from "@hono/zod-validator";
import { and, db, desc, eq, isNull, sql } from "@realityware/database";
import { bounty, bountySubmission } from "@realityware/database/schema/bounty";
import { shardAward } from "@realityware/database/schema/economy";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

export const bountyRouter = HonoApp()
  // All bounties (active + archive) plus the signed-in user's own submissions.
  .get("/", authMiddleware(), async (c) => {
    const acc = c.get("account");

    const bounties = await db
      .select()
      .from(bounty)
      .orderBy(desc(bounty.week));

    const submissions = await db
      .select()
      .from(bountySubmission)
      .where(eq(bountySubmission.userId, acc.id));

    return c.json({ success: true, bounties, submissions });
  })
  // Submit a build for a bounty. One submission per bounty per user.
  .post(
    "/submissions",
    authMiddleware(),
    zValidator(
      "json",
      z.object({
        bountyId: z.number().int().positive(),
        url: z.url(),
        notes: z.string().max(2000).optional(),
      }),
    ),
    async (c) => {
      const acc = c.get("account");
      const { bountyId, url, notes } = c.req.valid("json");

      const target = await db
        .select()
        .from(bounty)
        .where(eq(bounty.id, bountyId))
        .then((r) => r[0]);
      if (!target) {
        return c.json({ success: false, message: "bounty-not-found" } as const);
      }

      const existing = await db
        .select()
        .from(bountySubmission)
        .where(
          and(
            eq(bountySubmission.bountyId, bountyId),
            eq(bountySubmission.userId, acc.id),
          ),
        )
        .then((r) => r[0]);
      if (existing) {
        return c.json({ success: false, message: "already-submitted" } as const);
      }

      const [submission] = await db
        .insert(bountySubmission)
        .values({ bountyId, userId: acc.id, url, notes: notes ?? null })
        .returning();

      return c.json({ success: true, submission } as const);
    },
  )
  // Approve a submission → pay out the bounty's reward_shards. Admin-only.
  // ONE atomic transaction, idempotent via awarded_at (re-approve never double-pays).
  .post(
    "/submissions/:id/approve",
    authMiddleware("admin"),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const row = await db
        .select({ submission: bountySubmission, reward: bounty.rewardShards })
        .from(bountySubmission)
        .innerJoin(bounty, eq(bounty.id, bountySubmission.bountyId))
        .where(eq(bountySubmission.id, id))
        .then((r) => r[0]);
      if (!row) {
        return c.json({ success: false, message: "submission-not-found" });
      }
      if (row.submission.awardedAt) {
        return c.json({ success: false, message: "already-awarded" });
      }

      const reward = row.reward;
      const submitterId = row.submission.userId;

      const result = await db.transaction(async (tx) => {
        // Idempotency guard: only the first approval (awarded_at IS NULL) pays out.
        const [updated] = await tx
          .update(bountySubmission)
          .set({ status: "approved", awardedAt: new Date() })
          .where(
            and(eq(bountySubmission.id, id), isNull(bountySubmission.awardedAt)),
          )
          .returning({ id: bountySubmission.id });
        if (!updated) return { error: "already-awarded" as const };

        const [credited] = await tx
          .update(account)
          .set({ shards: sql`${account.shards} + ${reward}` })
          .where(eq(account.id, submitterId))
          .returning({ shards: account.shards });

        await tx.insert(shardAward).values({
          userId: submitterId,
          amount: reward,
          source: "bounty",
          refId: id,
        });

        return { shards: credited?.shards ?? null, reward };
      });

      if ("error" in result) {
        return c.json({ success: false, message: result.error });
      }
      return c.json({
        success: true,
        reward: result.reward,
        submitterShards: result.shards,
      });
    },
  )
  // Reject a submission (only if not already awarded). Admin-only.
  .post(
    "/submissions/:id/reject",
    authMiddleware("admin"),
    zValidator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const [updated] = await db
        .update(bountySubmission)
        .set({ status: "rejected" })
        .where(
          and(eq(bountySubmission.id, id), isNull(bountySubmission.awardedAt)),
        )
        .returning();

      if (!updated) {
        return c.json({
          success: false,
          message: "not-found-or-already-awarded",
        });
      }
      return c.json({ success: true, submission: updated });
    },
  );
