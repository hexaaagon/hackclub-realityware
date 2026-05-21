CREATE TYPE "public"."log_admin_action" AS ENUM('add-permissions', 'modify-permissions', 'remove-permissions', 'add-event', 'modify-event', 'remove-event', 'add-shop-item', 'modify-shop-item', 'remove-shop-item');--> statement-breakpoint
CREATE TYPE "public"."log_user_action" AS ENUM('user-modify', 'project-draft', 'project-delete', 'project-ship');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('software-web', 'software-mobile', 'software-windows', 'software-mac', 'software-linux', 'software-cross', 'hardware');--> statement-breakpoint
CREATE TYPE "public"."shipped_project_status" AS ENUM('shipped', 'reviewed', 'changes-needed', 'permanently-rejected', 'approved');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'on-review', 'on-review-drafted', 'silently-rejected', 'changes-needed', 'approved');--> statement-breakpoint
CREATE TYPE "public"."shop_item_category" AS ENUM('grant', 'items');--> statement-breakpoint
CREATE TYPE "public"."user_permissions" AS ENUM('member', 'reviewer', 'fulfillment', 'admin');--> statement-breakpoint
CREATE TABLE "achievement" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "achievement_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievement" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "log_admin" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log_admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"action" "log_admin_action" NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
ALTER TABLE "log_admin" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "log_user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"action" "log_user_action" NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
ALTER TABLE "log_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"encrypted_name" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hc_personal_info" (
	"id" integer PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"encrypted_first_name" text NOT NULL,
	"encrypted_last_name" text NOT NULL,
	"encrypted_address_one" text NOT NULL,
	"encrypted_address_two" text,
	"encrypted_city" text NOT NULL,
	"encrypted_state" text NOT NULL,
	"encrypted_country" text NOT NULL,
	"encrypted_zip_code" text NOT NULL,
	"encrypted_birthdate" text NOT NULL,
	CONSTRAINT "hc_personal_info_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "hc_personal_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"type" "project_type" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"code_url" text NOT NULL,
	"playable_url" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shipped_project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipped_project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"shipped_at" text NOT NULL,
	"status" "shipped_project_status" DEFAULT 'shipped' NOT NULL,
	"comment" text
);
--> statement-breakpoint
ALTER TABLE "shipped_project" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviewer_approved_project" (
	"id" integer PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer.id" integer NOT NULL,
	"ship_justification" text NOT NULL,
	"comment" text
);
--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviewer_need_changes_project" (
	"id" integer PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer.id" integer NOT NULL,
	"comment" text NOT NULL,
	"permanent_rejection" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviewer_project" (
	"id" integer PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer.id" integer,
	"reviewed_at" timestamp,
	"drafted" boolean DEFAULT false NOT NULL,
	"drafted_at" timestamp,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"fraud_passed" boolean,
	"fraud_score" integer DEFAULT -1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviewer_project" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviewer_project_note" (
	"id" integer PRIMARY KEY NOT NULL,
	"reviewer_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviewer_user_note" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviewer_user_note_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reviewer_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviewer_user_note" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shom_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shom_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"added_by" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "shop_item_category" NOT NULL,
	"cost" integer[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shom_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_account" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_account_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_permissions"[] DEFAULT '{"member"}',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"shards" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_user" ADD CONSTRAINT "log_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hc_personal_info" ADD CONSTRAINT "hc_personal_info_id_user_account_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hc_personal_info" ADD CONSTRAINT "hc_personal_info_email_user_account_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user_account"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipped_project" ADD CONSTRAINT "shipped_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_id_reviewer_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."reviewer_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_reviewer.id_user_account_id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_id_reviewer_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."reviewer_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_reviewer.id_user_account_id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_id_shipped_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."shipped_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_reviewer.id_user_account_id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_id_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_reviewer_id_user_account_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_user_note" ADD CONSTRAINT "reviewer_user_note_reviewer_id_user_account_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_user_note" ADD CONSTRAINT "reviewer_user_note_user_id_user_account_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shom_item" ADD CONSTRAINT "shom_item_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");