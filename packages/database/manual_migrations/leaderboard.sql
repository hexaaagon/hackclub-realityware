-- Leaderboard (nihad-owned). Additive only — mirrors src/schema/city.ts and the
-- user_account.city_id column added in src/schema/user.ts.

CREATE TABLE "city" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "name"       text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "city_score" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "city_id"    integer NOT NULL,
  "points"     integer DEFAULT 0 NOT NULL,
  "reason"     text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "city_score_city_id_city_id_fk"
    FOREIGN KEY ("city_id") REFERENCES "public"."city"("id")
);

CREATE TABLE "time_log" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "user_id"    integer NOT NULL,
  "seconds"    integer NOT NULL,
  "source"     text,
  "logged_at"  timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "time_log_user_id_user_account_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id")
);

-- Additive column on hexaa's user_account (sanctioned: user_account.city_id is mine).
ALTER TABLE "user_account" ADD COLUMN IF NOT EXISTS "city_id" integer;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_account_city_id_city_id_fk'
  ) THEN
    ALTER TABLE "user_account"
      ADD CONSTRAINT "user_account_city_id_city_id_fk"
      FOREIGN KEY ("city_id") REFERENCES "public"."city"("id");
  END IF;
END $$;

ALTER TABLE "city" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "city_score" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "time_log" ENABLE ROW LEVEL SECURITY;
