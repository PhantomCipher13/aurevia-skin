import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client using service role key.
 * ONLY use in server-side API routes — never expose to client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
