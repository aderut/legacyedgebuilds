import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load blog posts." }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.slug || !body.title || !body.image) {
    return NextResponse.json({ error: "Slug, title, and image are required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      image: body.image,
      date: body.date || new Date().toISOString().slice(0, 10),
      content: body.content || [],
    })
    .select()
    .single();

  if (error) {
    const message = error.code === "23505" ? "A post with this slug already exists." : "Failed to create post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ post: data });
}
