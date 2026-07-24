import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rating, message } = body;

    if (!name || !message || !rating) {
      return NextResponse.json({ error: "Name, rating, and message are required." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const { error } = await supabase.from("reviews").insert({
      name,
      rating,
      message,
      source: "website",
      approved: false,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not save review." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
