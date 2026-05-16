import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

/**
 * WARNING: DON'T USE THIS ON CLIENT COMPONENTS
 *
 * Creates a Supabase client with service role privileges that bypasses RLS.
 * This client should NEVER be used on the client side or exposed to users.
 */
export const createServiceServer = () => {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_DATABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_DATABASE_SECRET_KEY}`,
        },
      },
    },
  );
};

/**
 * WARNING: DON'T USE THIS ON CLIENT COMPONENTS
 *
 * Creates a Supabase client with service role privileges that bypasses RLS.
 * This client should NEVER be used on the client side or exposed to users.
 */
export const supabaseService = createServiceServer();
