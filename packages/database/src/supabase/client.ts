import { env } from "@realityware/env";
import type { Database } from "@realityware/shared/types/database";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl!, supabaseKey!);
