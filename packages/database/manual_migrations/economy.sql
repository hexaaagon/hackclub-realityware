-- Economy engine (nihad-owned). Additive only. Mirrors src/schema/economy.ts +
-- new columns on bounty / bounty_submission / time_log / city.

-- New columns (idempotent)
ALTER TABLE "bounty" ADD COLUMN IF NOT EXISTS "reward_shards" integer NOT NULL DEFAULT 100;
ALTER TABLE "bounty_submission" ADD COLUMN IF NOT EXISTS "awarded_at" timestamp;
ALTER TABLE "time_log" ADD COLUMN IF NOT EXISTS "scored_at" timestamp;

-- city.name UNIQUE (guarded)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'city_name_unique') THEN
    ALTER TABLE "city" ADD CONSTRAINT "city_name_unique" UNIQUE ("name");
  END IF;
END $$;

-- Enums (guarded)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_tier') THEN
    CREATE TYPE "public"."project_tier" AS ENUM ('S', 'A', 'B', 'C');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shard_award_source') THEN
    CREATE TYPE "public"."shard_award_source" AS ENUM ('bounty');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "project_city_award" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "project_id" integer NOT NULL UNIQUE,
  "tier"       "public"."project_tier" NOT NULL,
  "points"     integer NOT NULL,
  "awarded_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "project_city_award_project_id_project_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "public"."project"("id")
);

CREATE TABLE IF NOT EXISTS "user_hours_score" (
  "user_id"        integer PRIMARY KEY NOT NULL,
  "awarded_points" integer DEFAULT 0 NOT NULL,
  "updated_at"     timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_hours_score_user_id_user_account_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id")
);

CREATE TABLE IF NOT EXISTS "shard_award" (
  "id"         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "user_id"    integer NOT NULL,
  "amount"     integer NOT NULL,
  "source"     "public"."shard_award_source" NOT NULL,
  "ref_id"     integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "shard_award_user_id_user_account_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user_account"("id")
);

ALTER TABLE "project_city_award" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_hours_score" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shard_award" ENABLE ROW LEVEL SECURITY;

-- Canonical cities seed (idempotent via UNIQUE(name)), each with a 0 score row.
INSERT INTO "city" ("name") VALUES ('Ved'), ('Valdia'), ('Laria'), ('Mora')
  ON CONFLICT ("name") DO NOTHING;

INSERT INTO "city_score" ("city_id", "points", "reason")
  SELECT c.id, 0, 'seed' FROM "city" c
  WHERE c.name IN ('Ved', 'Valdia', 'Laria', 'Mora')
    AND NOT EXISTS (
      SELECT 1 FROM "city_score" s WHERE s.city_id = c.id AND s.reason = 'seed'
    );
