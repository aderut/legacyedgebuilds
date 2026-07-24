import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load enquiries." }, { status: 500 });
  }

  return NextResponse.json({ enquiries: data });
}
