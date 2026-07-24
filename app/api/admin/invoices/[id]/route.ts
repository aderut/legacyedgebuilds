import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("invoices").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  return NextResponse.json({ invoice: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabaseAdmin
    .from("invoices")
    .update({
      client_name: body.client_name,
      client_email: body.client_email || null,
      client_phone: body.client_phone || null,
      project_type: body.project_type || null,
      items: body.items,
      tax_rate: body.tax_rate || 0,
      notes: body.notes || "",
      status: body.status,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Failed to update invoice." }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("invoices").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Failed to delete invoice." }, { status: 500 });
  return NextResponse.json({ success: true });
}
