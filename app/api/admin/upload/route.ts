import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function POST(request: Request) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const folder = (formData.get("folder") as string) || "misc";
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WebP images are allowed." },
        { status: 400 }
      );
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "Image must be under 10MB. Compress it and try again." },
        { status: 400 }
      );
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "");
    const ext = file.name.split(".").pop();
    const filename = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error } = await supabaseAdmin.storage
      .from("site-images")
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from("site-images").getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
