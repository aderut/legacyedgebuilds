import { createClient, SupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY client. Uses the service role key, which bypasses row-level
// security — never import this file from a client component, and never
// expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
//
// Built lazily (on first use, not on import) so a missing env var produces a
// clear error from inside a route's try/catch instead of crashing the whole
// module — which previously showed up in the browser as a vague "Network
// error" with no explanation.
let client: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local has real values (not placeholders) and restart the dev server."
    );
  }

  client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const real = getSupabaseAdmin();
    // @ts-expect-error dynamic proxy forwarding
    return real[prop];
  },
});
