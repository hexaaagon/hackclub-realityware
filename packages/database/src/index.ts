import { env } from "@realityware/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export * from "drizzle-orm";
export const client = postgres(env.SUPABASE_DATABASE_TRANSACTION_POOLER);
export const db = drizzle({ client: client });
