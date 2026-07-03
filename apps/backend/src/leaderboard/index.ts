import { zValidator } from "@hono/zod-validator";
import { db, eq, gte, isNotNull, isNull, sql } from "@realityware/database";
import { city, cityScore, timeLog } from "@realityware/database/schema/city";
import {
  projectCityAward,
  userHoursScore,
} from "@realityware/database/schema/economy";
import { project } from "@realityware/database/schema/project";
import { account } from "@realityware/database/schema/user";
import z from "zod";
import { authMiddleware } from "../../lib/auth";
import { HonoApp } from "../app";

const TIER_POINTS = { S: 100, A: 100, B: 66, C: 33 } as const;
const FREE_SECONDS = 3600; // first hour (of a user's first project) is not scored
const POINTS_PER_HOUR = 5;

/**
 * Idempotent hours-scoring writer: turns time_log into city_score at 5 pts/hour,
 * excluding each user's first hour. Uses a per-user high-water-mark
 * (user_hours_score) so re-runs never double-count. Correct-but-zero until
 * hexaa's Hackatime/Lapse ingestion feeds time_log.
 */
export async function runHoursScoring() {
  return db.transaction(async (tx) => {
    const totals = await tx
      .select({
        userId: timeLog.userId,
        cityId: account.cityId,
        total: sql<number>`coalesce(sum(${timeLog.seconds}), 0)::int`,
      })
      .from(timeLog)
      .innerJoin(account, eq(account.id, timeLog.userId))
      .where(isNotNull(account.cityId))
      .groupBy(timeLog.userId, account.cityId);

    const prev = await tx.select().from(userHoursScore);
    const prevMap = new Map(prev.map((p) => [p.userId, p.awardedPoints]));

    let usersScored = 0;
    let pointsAwarded = 0;
    for (const row of totals) {
      if (row.cityId == null) continue;
      const eligibleHours = Math.floor(
        Math.max(0, row.total - FREE_SECONDS) / 3600,
      );
      const target = eligibleHours * POINTS_PER_HOUR;
      const delta = target - (prevMap.get(row.userId) ?? 0);
      if (delta === 0) continue;

      await tx
        .insert(cityScore)
        .values({ cityId: row.cityId, points: delta, reason: "hours" });
      await tx
        .insert(userHoursScore)
        .values({ userId: row.userId, awardedPoints: target })
        .onConflictDoUpdate({
          target: userHoursScore.userId,
          set: { awardedPoints: target, updatedAt: new Date() },
        });
      usersScored += 1;
      pointsAwarded += delta;
    }

    // Audit marker: every accounted row is stamped scored.
    await tx
      .update(timeLog)
      .set({ scoredAt: new Date() })
      .where(isNull(timeLog.scoredAt));

    return { usersScored, pointsAwarded };
  });
}

export const leaderboardRouter = HonoApp()
  .get("/", authMiddleware(), async (c) => {
    const acc = c.get("account");

    const cities = await db.select().from(city);

    // Total points per city (sum of append-only score events).
    const scoreRows = await db
      .select({
        cityId: cityScore.cityId,
        total: sql<number>`coalesce(sum(${cityScore.points}), 0)::int`,
      })
      .from(cityScore)
      .groupBy(cityScore.cityId);

    // Members + total coding seconds per city.
    const aggRows = await db
      .select({
        cityId: account.cityId,
        members: sql<number>`count(distinct ${account.id})::int`,
        seconds: sql<number>`coalesce(sum(${timeLog.seconds}), 0)::int`,
      })
      .from(account)
      .leftJoin(timeLog, eq(timeLog.userId, account.id))
      .where(isNotNull(account.cityId))
      .groupBy(account.cityId);

    // "People coding today" — distinct users with a time log since 00:00 UTC.
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const [onlineRow] = await db
      .select({ n: sql<number>`count(distinct ${timeLog.userId})::int` })
      .from(timeLog)
      .where(gte(timeLog.loggedAt, startOfDay));

    const scoreMap = new Map(scoreRows.map((r) => [r.cityId, r.total]));
    const aggMap = new Map(aggRows.map((r) => [r.cityId, r]));

    const ranked = cities
      .map((city) => {
        const agg = aggMap.get(city.id);
        return {
          id: city.id,
          name: city.name,
          score: scoreMap.get(city.id) ?? 0,
          members: agg?.members ?? 0,
          hours: Math.round(((agg?.seconds ?? 0) / 3600) * 10) / 10,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.hours - a.hours ||
          a.name.localeCompare(b.name),
      )
      .map((city, i) => ({ ...city, rank: i + 1 }));

    return c.json({
      success: true,
      cities: ranked,
      onlineToday: onlineRow?.n ?? 0,
      myCityId: acc.cityId ?? null,
    });
  })
  // The canonical cities (for the participant city picker).
  .get("/cities", authMiddleware(), async (c) => {
    const cities = await db
      .select({ id: city.id, name: city.name })
      .from(city)
      .orderBy(city.name);
    return c.json({ success: true, cities });
  })
  // Seam: run the hours-scoring engine (idempotent). Admin/cron triggers this
  // after Hackatime/Lapse ingestion has written time_log rows.
  .post("/score-hours", authMiddleware("admin"), async (c) => {
    const summary = await runHoursScoring();
    return c.json({ success: true, ...summary });
  })
  // Seam: hexaa's review calls this when it assigns a project a tier. Credits the
  // project owner's city by tier (S/A=100, B=66, C=33). Idempotent per project.
  .post(
    "/award-tier",
    authMiddleware("admin"),
    zValidator(
      "json",
      z.object({
        projectId: z.number().int().positive(),
        tier: z.enum(["S", "A", "B", "C"]),
      }),
    ),
    async (c) => {
      const { projectId, tier } = c.req.valid("json");
      const points = TIER_POINTS[tier];

      const proj = await db
        .select({ ownerId: project.userId })
        .from(project)
        .where(eq(project.id, projectId))
        .then((r) => r[0]);
      if (!proj) {
        return c.json({ success: false, message: "project-not-found" });
      }

      const owner = await db
        .select({ cityId: account.cityId })
        .from(account)
        .where(eq(account.id, proj.ownerId))
        .then((r) => r[0]);
      if (!owner?.cityId) {
        return c.json({ success: false, message: "owner-has-no-city" });
      }
      const cityId = owner.cityId;

      const result = await db.transaction(async (tx) => {
        // UNIQUE(project_id) → first award wins; re-calls are no-ops.
        const inserted = await tx
          .insert(projectCityAward)
          .values({ projectId, tier, points })
          .onConflictDoNothing({ target: projectCityAward.projectId })
          .returning({ id: projectCityAward.id });
        if (inserted.length === 0) return { error: "already-awarded" as const };

        await tx
          .insert(cityScore)
          .values({ cityId, points, reason: `tier:${tier}` });
        return { points, cityId };
      });

      if ("error" in result) {
        return c.json({ success: false, message: result.error });
      }
      return c.json({ success: true, points: result.points, cityId });
    },
  );
