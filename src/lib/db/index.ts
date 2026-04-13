import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres(
  process.env.SUPABASE_DATABASE_TRANSACTION_POOLER,
);
export const db = drizzle({ client: client });
