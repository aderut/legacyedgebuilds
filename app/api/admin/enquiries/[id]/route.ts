import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

const validStatuses = ["new", "contacted", "won", "lost"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("enquiries")
    .update({ status: body.status })
    .eq("id", params.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update enquiry." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
