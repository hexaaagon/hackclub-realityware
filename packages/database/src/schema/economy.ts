import { integer, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";
import { account } from "./user";

export const projectTierEnum = pgEnum("project_tier", ["S", "A", "B", "C"]);
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

export const userHoursScore = pgTable("user_hours_score", {
  userId: integer("user_id")
    .primaryKey()
    .notNull()
    .references(() => account.id),
  awardedPoints: integer("awarded_points").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export const shardAwardSourceEnum = pgEnum("shard_award_source", ["bounty"]);

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
