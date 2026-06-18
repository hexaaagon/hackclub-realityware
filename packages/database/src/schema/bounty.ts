import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./user";

// --- Bounties (nihad-owned) ---------------------------------------------------
// Weekly "26 Green" challenges + participant submissions. Matches Assets/Bounties.pdf.

export const bountyStatusEnum = pgEnum("bounty_status", ["active", "archived"]);
export const bountySubmissionStatusEnum = pgEnum("bounty_submission_status", [
  "pending",
  "approved",
  "rejected",
]);

export const bounty = pgTable("bounty", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  // Program week this bounty belongs to (1..12).
  week: integer("week").notNull(),
  title: text("title").notNull(),
  // The bounty prompt / brief.
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: bountyStatusEnum("status").notNull().default("active"),
  // Shards awarded on approval (plan range 100–500; set at bounty creation).
  rewardShards: integer("reward_shards").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

export const bountySubmission = pgTable("bounty_submission", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  bountyId: integer("bounty_id")
    .notNull()
    .references(() => bounty.id),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  // Link to the build (repo / demo / writeup).
  url: text("url").notNull(),
  notes: text("notes"),
  status: bountySubmissionStatusEnum("status").notNull().default("pending"),
  // Set the moment shards are paid out — the idempotency guard for approval.
  awardedAt: timestamp("awarded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
