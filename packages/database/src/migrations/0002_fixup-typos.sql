CREATE TABLE "shop_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shop_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"added_by" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "shop_item_category" NOT NULL,
	"cost" integer[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shop_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ticket_leaderboard_history" (
	"date" text NOT NULL,
	"slack_id" text NOT NULL,
	"count_of_tickets" integer NOT NULL,
	CONSTRAINT "ticket_leaderboard_history_date_slack_id_pk" PRIMARY KEY("date","slack_id")
);
--> statement-breakpoint
ALTER TABLE "ticket_leaderboard_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "shom_item" CASCADE;--> statement-breakpoint
DROP TABLE "ticker_leaderboard_history" CASCADE;--> statement-breakpoint
ALTER TABLE "shop_item" ADD CONSTRAINT "shop_item_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;