import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("gallery_items").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabaseAdmin
    .from("gallery_items")
    .update({ title: body.title, category: body.category, image: body.image })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Failed to update gallery item." }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("gallery_items").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  return NextResponse.json({ success: true });
}
