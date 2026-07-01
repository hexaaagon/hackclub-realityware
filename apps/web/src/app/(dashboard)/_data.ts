import "server-only";

import { auth } from "@realityware/auth/server";
import { db, eq, gte, sql } from "@realityware/database";
import { timeLog } from "@realityware/database/schema/city";
import { account } from "@realityware/database/schema/user";
import { headers } from "next/headers";

type AccountRow = typeof account.$inferSelect;

/** The slice of the account row the dashboard shell needs. */
export type DashboardAccount = Pick<
  AccountRow,
  "displayName" | "avatar" | "shards"
>;

export type DashboardData = {
  account: DashboardAccount;
  /** Current program week, clamped 1–12. */
  week: number;
  /** People coding today. */
  onlineCount: number;
};

// Program week (placeholder until a real schedule source exists).
const PROGRAM_WEEK = Math.min(12, Math.max(1, 3));

// Rendered when there's no session (DEV_AUTH_BYPASS / not logged in) so the
// dashboard shell still renders without a real account.
const PLACEHOLDER_ACCOUNT: DashboardAccount = {
  displayName: "Guest",
  avatar: "",
  shards: 0,
};

/**
 * Real dashboard data, read from the live DB for the signed-in participant.
 * Falls back to a placeholder account when there is no session so the shell
 * still renders (e.g. DEV_AUTH_BYPASS). The `DashboardData` shape is unchanged,
 * so no caller needs editing. Sign in via real HCA (email prefixed
 * `REALITYWAREDEVACCESS3000-…`) to see your real shards/name/avatar.
 */
export async function getDashboardData(): Promise<DashboardData> {
  let dashboardAccount = PLACEHOLDER_ACCOUNT;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      const row = await db
        .select({
          displayName: account.displayName,
          avatar: account.avatar,
          shards: account.shards,
        })
        .from(account)
        .where(eq(account.userId, session.user.id))
        .then((rows) => rows[0]);
      if (row) dashboardAccount = row;
    }
  } catch {
    // no session / transient DB error → keep the placeholder so the shell renders
  }

  // People coding today = distinct users with a time_log since 00:00 UTC.
  // (Same source as GET /api/leaderboard. 0 until time-tracking ingestion lands.)
  let onlineCount = 0;
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const [row] = await db
      .select({ n: sql<number>`count(distinct ${timeLog.userId})::int` })
      .from(timeLog)
      .where(gte(timeLog.loggedAt, startOfDay));
    onlineCount = row?.n ?? 0;
  } catch {
    // table/transient error → fall back to 0
  }

  return {
    account: dashboardAccount,
    week: PROGRAM_WEEK,
    onlineCount,
  };
}
