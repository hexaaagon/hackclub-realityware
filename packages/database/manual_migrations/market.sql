-- Market (nihad-owned). Additive only — mirrors src/schema/market.ts.
CREATE TYPE "public"."user_shop_item_status" AS ENUM ('active', 'sold', 'inactive');
CREATE TYPE "public"."shard_transfer_type" AS ENUM ('gift', 'market_purchase');

CREATE TABLE "user_shop" (
  "id"          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "owner"       integer NOT NULL UNIQUE,
  "name"        text NOT NULL,
  "description" text NOT NULL,
  "created_at"  timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_shop_owner_user_account_id_fk"
    FOREIGN KEY ("owner") REFERENCES "public"."user_account"("id")
);

CREATE TABLE "user_shop_item" (
  "id"           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "shop"         integer NOT NULL,
  "title"        text NOT NULL,
  "description"  text NOT NULL,
  "image_url"    text,
  "price_shards" integer NOT NULL,
  "status"       "public"."user_shop_item_status" DEFAULT 'active' NOT NULL,
  "created_at"   timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_shop_item_shop_user_shop_id_fk"
    FOREIGN KEY ("shop") REFERENCES "public"."user_shop"("id")
);

CREATE TABLE "shard_transfer" (
  "id"                integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  "from_user"         integer NOT NULL,
  "to_user"           integer NOT NULL,
  "amount"            integer NOT NULL,
  "type"              "public"."shard_transfer_type" NOT NULL,
  "note"              text,
  "user_shop_item_id" integer,
  "created_at"        timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "shard_transfer_from_user_user_account_id_fk"
    FOREIGN KEY ("from_user") REFERENCES "public"."user_account"("id"),
  CONSTRAINT "shard_transfer_to_user_user_account_id_fk"
    FOREIGN KEY ("to_user") REFERENCES "public"."user_account"("id"),
  CONSTRAINT "shard_transfer_user_shop_item_id_user_shop_item_id_fk"
    FOREIGN KEY ("user_shop_item_id") REFERENCES "public"."user_shop_item"("id")
);

ALTER TABLE "user_shop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_shop_item" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shard_transfer" ENABLE ROW LEVEL SECURITY;
