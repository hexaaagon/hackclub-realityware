import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { account } from "./user";

// --- Leaderboard (nihad-owned) ------------------------------------------------
// Cities participants compete for, append-only score events, and Hackatime-style
// time logs (also powers the "people coding today" count).

export const city = pgTable("city", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  // Unique so the canonical city seed (Ved/Valdia/Laria/Mora) is idempotent.
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

// Append-only score events; a city's total is the sum of its points.
export const cityScore = pgTable("city_score", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  cityId: integer("city_id")
    .notNull()
    .references(() => city.id),
  points: integer("points").notNull().default(0),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

// Coding-time entries (Hackatime ingest). `seconds` per log; `loggedAt` is the
// day the time was logged.
export const timeLog = pgTable("time_log", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  seconds: integer("seconds").notNull(),
  source: text("source"),
  // Stamped by the hours-scoring engine once a row has been accounted (audit).
  scoredAt: timestamp("scored_at"),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();
