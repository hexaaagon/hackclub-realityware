import { env } from "@realityware/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  dialect: "postgresql",
  out: "./src/migrations",
  dbCredentials: {
    url: env.SUPABASE_DATABASE_TRANSACTION_POOLER,
  },
} satisfies Config;
