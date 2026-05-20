CREATE TYPE "public"."log-admin-action" AS ENUM('add-permissions', 'modify-permissions', 'remove-permissions', 'add-event', 'modify-event', 'remove-event', 'add-shop-item', 'modify-shop-item', 'remove-shop-item');--> statement-breakpoint
CREATE TYPE "public"."log-user-action" AS ENUM('user-create', 'user-edit', 'project-draft', 'project-delete', 'project-ship');--> statement-breakpoint
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
CREATE TABLE "log-admin" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log-admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"action" "log-admin-action" NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "log-user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log-user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"action" "log-user-action" NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
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
CREATE TABLE "shipped_project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipped_project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"shipped_at" text NOT NULL,
	"status" "shipped_project_status" DEFAULT 'shipped' NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "reviewer_approved_project" (
	"id" integer PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer.id" integer NOT NULL,
	"ship_justification" text NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "reviewer_need_changes_project" (
	"id" integer PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reviewer.id" integer NOT NULL,
	"comment" text NOT NULL,
	"permanent_rejection" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "reviewer_project_note" (
	"id" integer PRIMARY KEY NOT NULL,
	"reviewer_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviewer_user_note" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviewer_user_note_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reviewer_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shom_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shom_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"added_by" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "shop_item_category" NOT NULL,
	"cost" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_account" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_account_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"role" "user_permissions"[] DEFAULT '{"member"}',
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	"shards" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log-admin" ADD CONSTRAINT "log-admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log-user" ADD CONSTRAINT "log-user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipped_project" ADD CONSTRAINT "shipped_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_id_reviewer_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."reviewer_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_project_id_reviewer_project_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."reviewer_project"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_approved_project" ADD CONSTRAINT "reviewer_approved_project_reviewer.id_reviewer_project_reviewer.id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."reviewer_project"("reviewer.id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_id_reviewer_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."reviewer_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_project_id_reviewer_project_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."reviewer_project"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_need_changes_project" ADD CONSTRAINT "reviewer_need_changes_project_reviewer.id_reviewer_project_reviewer.id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."reviewer_project"("reviewer.id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_id_shipped_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."shipped_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project" ADD CONSTRAINT "reviewer_project_reviewer.id_user_account_id_fk" FOREIGN KEY ("reviewer.id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_id_project_id_fk" FOREIGN KEY ("id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_reviewer_id_user_account_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_project_note" ADD CONSTRAINT "reviewer_project_note_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_user_note" ADD CONSTRAINT "reviewer_user_note_reviewer_id_user_account_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewer_user_note" ADD CONSTRAINT "reviewer_user_note_user_id_user_account_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shom_item" ADD CONSTRAINT "shom_item_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;