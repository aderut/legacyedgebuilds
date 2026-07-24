import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at");
  if (error) return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const required = ["slug", "name", "category", "image"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      slug: body.slug,
      name: body.name,
      category: body.category,
      image: body.image,
      description: body.description || "",
      features: body.features || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      applications: body.applications || [],
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    const message = error.code === "23505" ? "A product with this slug already exists." : "Failed to create product.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}
