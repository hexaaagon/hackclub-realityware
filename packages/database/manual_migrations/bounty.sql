-- Bounties (nihad-owned). Additive only — mirrors src/schema/bounty.ts.
CREATE TYPE "public"."bounty_status" AS ENUM ('active', 'archived');
CREATE TYPE "public"."bounty_submission_status" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE "bounty" (
  "id"          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "week"        integer NOT NULL,
  "title"       text NOT NULL,
  "description" text NOT NULL,
  "image_url"   text,
  "status"      "public"."bounty_status" DEFAULT 'active' NOT NULL,
  "created_at"  timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "bounty_submission" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "bounty_id"  integer NOT NULL,
  "user_id"    integer NOT NULL,
  "url"        text NOT NULL,
  "notes"      text,
  "status"     "public"."bounty_submission_status" DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "bounty_submission_bounty_id_bounty_id_fk"
    FOREIGN KEY ("bounty_id") REFERENCES "public"."bounty"("id"),
  CONSTRAINT "bounty_submission_user_id_user_account_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id")
);

ALTER TABLE "bounty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bounty_submission" ENABLE ROW LEVEL SECURITY;
