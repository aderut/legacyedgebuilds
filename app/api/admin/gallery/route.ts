import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("gallery_items").select("*").order("created_at");
  if (error) return NextResponse.json({ error: "Failed to load gallery items." }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.title || !body.category || !body.image) {
    return NextResponse.json({ error: "Title, category, and image are required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("gallery_items")
    .insert({ title: body.title, category: body.category, image: body.image })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create gallery item." }, { status: 500 });
  return NextResponse.json({ item: data });
}
