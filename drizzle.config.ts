import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/lib/db/schema",
  dialect: "postgresql",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: env.SUPABASE_DATABASE_TRANSACTION_POOLER,
  },
} satisfies Config;
