CREATE TABLE "ticket_leaderboard" (
	"slack_id" text PRIMARY KEY NOT NULL,
	"count_of_tickets" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ticket_leaderboard" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ticker_leaderboard_history" (
	"date" text NOT NULL,
	"slack_id" text NOT NULL,
	"count_of_tickets" integer NOT NULL,
	CONSTRAINT "ticker_leaderboard_history_date_slack_id_pk" PRIMARY KEY("date","slack_id")
);
--> statement-breakpoint
ALTER TABLE "ticker_leaderboard_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ticket_metadata" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text
);
--> statement-breakpoint
ALTER TABLE "ticket_metadata" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tickets" (
	"ticket_ts" text PRIMARY KEY NOT NULL,
	"original_channel" text NOT NULL,
	"original_ts" text NOT NULL,
	"responders" text[] NOT NULL,
	"resolved" boolean NOT NULL,
	"grace_timer_expiry" bigint,
	"force_open" boolean NOT NULL,
	"last_responder_id" text,
	"in_queue" boolean NOT NULL,
	"closure_message_ts" text,
	"last_resolved_ts" bigint
);
--> statement-breakpoint
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;