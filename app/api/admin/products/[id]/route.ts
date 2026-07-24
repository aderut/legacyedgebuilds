import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabaseAdmin
    .from("products")
    .update({
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
    .eq("id", params.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  return NextResponse.json({ success: true });
}
