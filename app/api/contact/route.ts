import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, projectType, preferredSize, preferredColor, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        name,
        phone,
        email: email || null,
        project_type: projectType || null,
        preferred_size: preferredSize || null,
        preferred_color: preferredColor || null,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not save enquiry." }, { status: 500 });
    }

    // Notify the business owner by email. This is best-effort — if Resend
    // isn't configured yet, or the send fails, the enquiry is still saved
    // above and visible in /admin/enquiries either way.
    const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (notifyTo) {
      try {
        await sendEmail({
          to: notifyTo,
          subject: `New quote request from ${name}`,
          html: `
            <div style="font-family: Georgia, serif; color: #0B0B0C; padding: 24px;">
              <h2 style="color: #7C5F22;">New Quote Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email || "—"}</p>
              <p><strong>Project Type:</strong> ${projectType || "—"}</p>
              <p><strong>Preferred Size:</strong> ${preferredSize || "—"}</p>
              <p><strong>Preferred Color:</strong> ${preferredColor || "—"}</p>
              <p><strong>Message:</strong><br/>${message}</p>
              <p style="margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/enquiries"
                   style="color: #C9A24B;">View in admin dashboard →</a>
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Admin notification email failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, enquiry: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
