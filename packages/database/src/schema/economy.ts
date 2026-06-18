import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { city } from "./city";
import { project } from "./project";
import { account } from "./user";

// --- Economy engine (nihad-owned) --------------------------------------------
// Idempotency + audit tables for the leaderboard scoring engine and bounty
// payouts. None of these modify hexaa's project/review schema — project_city_award
// references project read-only.

export const projectTierEnum = pgEnum("project_tier", ["S", "A", "B", "C"]);

// One tier award per project (UNIQUE project_id) → re-calling award-tier can
// never double-credit a city. Tracks the seam without touching the project table.
export const projectCityAward = pgTable("project_city_award", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  projectId: integer("project_id")
    .notNull()
    .unique()
    .references(() => project.id),
  tier: projectTierEnum("tier").notNull(),
  points: integer("points").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
}).enableRLS();

// Per-user high-water-mark of leaderboard points already awarded for coding
// hours. Makes the hours engine idempotent and lets it exclude the first hour.
export const userHoursScore = pgTable("user_hours_score", {
  userId: integer("user_id")
    .primaryKey()
    .notNull()
    .references(() => account.id),
  awardedPoints: integer("awarded_points").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export const shardAwardSourceEnum = pgEnum("shard_award_source", ["bounty"]);

// Audit ledger for system→user shard credits (bounty payouts). Peer transfers
// live in shard_transfer.
export const shardAward = pgTable("shard_award", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  amount: integer("amount").notNull(),
  source: shardAwardSourceEnum("source").notNull(),
  refId: integer("ref_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
