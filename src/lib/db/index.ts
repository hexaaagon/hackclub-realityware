import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";

export const client = postgres(env.SUPABASE_DATABASE_TRANSACTION_POOLER);
export const db = drizzle({ client: client });
