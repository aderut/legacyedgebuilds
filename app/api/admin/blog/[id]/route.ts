import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("blog_posts").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ post: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .update({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      image: body.image,
      date: body.date,
      content: body.content || [],
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  return NextResponse.json({ success: true });
}
