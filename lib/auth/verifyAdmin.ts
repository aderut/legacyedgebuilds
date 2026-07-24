import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Verifies the Supabase access token sent by an admin-dashboard request.
 * Returns the authenticated user, or null if the token is missing/invalid.
 * All /api/admin/* routes call this before touching the database.
 */
export async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user;
}
