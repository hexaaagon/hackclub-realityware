import type { Config } from "drizzle-kit";

const databaseUrl =
  process.env.SUPABASE_DATABASE_TRANSACTION_POOLER ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database URL. Set SUPABASE_DATABASE_TRANSACTION_POOLER or DATABASE_URL.",
  );
}

export default {
  schema: "./src/schema",
  dialect: "postgresql",
  out: "./src/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
  entities: {
    roles: {
      provider: "supabase",
    },
  },
} satisfies Config;
