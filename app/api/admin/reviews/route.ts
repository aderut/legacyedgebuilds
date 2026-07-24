import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

export async function POST(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.name || !body.message || !body.rating) {
    return NextResponse.json({ error: "Name, rating, and message are required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      name: body.name,
      rating: body.rating,
      message: body.message,
      source: "whatsapp",
      approved: true, // admin-added reviews are trusted immediately
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ review: data });
}
