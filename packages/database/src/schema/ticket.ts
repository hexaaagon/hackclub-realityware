import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const ticket = pgTable("tickets", {
  ticketTs: text("ticket_ts").primaryKey(),
  originalChannel: text("original_channel").notNull(),
  originalTs: text("original_ts").notNull(),
  responders: text("responders").array().notNull(),
  resolved: boolean("resolved").notNull(),
  graceTimerExpiry: bigint("grace_timer_expiry", { mode: "number" }),
  forceOpen: boolean("force_open").notNull(),
  lastResponderId: text("last_responder_id"),
  inQueue: boolean("in_queue").notNull(),
  closureMessageTs: text("closure_message_ts"),
  lastResolvedTs: bigint("last_resolved_ts", { mode: "number" }),
}).enableRLS();

export const leaderboard = pgTable("ticket_leaderboard", {
  slackId: text("slack_id").primaryKey(),
  countOfTickets: integer("count_of_tickets").notNull(),
}).enableRLS();

export const leaderboardHistory = pgTable(
  "ticket_leaderboard_history",
  {
    date: text("date").notNull(),
    slackId: text("slack_id").notNull(),
    countOfTickets: integer("count_of_tickets").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.date, table.slackId] }),
  }),
).enableRLS();

export const metadata = pgTable("ticket_metadata", {
  key: text("key").primaryKey(),
  value: text("value"),
}).enableRLS();
