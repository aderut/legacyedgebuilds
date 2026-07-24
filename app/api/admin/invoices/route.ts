import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";
import { buildInvoicePdf, invoiceNumber, invoiceTotals, type Invoice } from "@/lib/pdf/invoice";
import { sendEmail } from "@/lib/email/sendEmail";

export async function GET(request: Request) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ invoices: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load invoices.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    if (!body.client_name || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Client name and at least one line item are required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("invoices")
      .insert({
        enquiry_id: body.enquiry_id || null,
        client_name: body.client_name,
        client_email: body.client_email || null,
        client_phone: body.client_phone || null,
        project_type: body.project_type || null,
        items: body.items,
        tax_rate: body.tax_rate || 0,
        notes: body.notes || "",
        status: body.status || "draft",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      // error.code 42P01 = table does not exist — the most common cause here
      // is that supabase/invoices.sql hasn't been run yet.
      const hint =
        error.code === "42P01"
          ? "The invoices table doesn't exist yet — run supabase/invoices.sql in the Supabase SQL editor."
          : error.message;
      return NextResponse.json({ error: hint }, { status: 500 });
    }

    // Auto-send the invoice email immediately if we have a client email and
    // Resend is configured. Best-effort: invoice creation still succeeds
    // even if the email fails to send — the client just won't get emailed
    // automatically and can be sent later from the invoice page.
    let emailSent = false;
    if (data.client_email && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        const typedInvoice = data as Invoice;
        const doc = buildInvoicePdf(typedInvoice);
        const pdfBase64 = Buffer.from(doc.output("arraybuffer")).toString("base64");
        const { total } = invoiceTotals(typedInvoice.items, typedInvoice.tax_rate);
        const number = invoiceNumber(typedInvoice);

        await sendEmail({
          to: data.client_email,
          subject: `Invoice ${number} from Legacy Edge Builds`,
          html: `
            <div style="font-family: Georgia, serif; color: #0B0B0C; padding: 24px;">
              <h2 style="color: #7C5F22;">Legacy Edge Builds</h2>
              <p>Dear ${data.client_name},</p>
              <p>Please find attached invoice <strong>${number}</strong> for a total of
              <strong>NGN ${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</strong>.</p>
              <p>If you have any questions, feel free to reply to this email or reach us on WhatsApp.</p>
              <p style="margin-top: 24px;">Kind regards,<br/>Legacy Edge Builds</p>
            </div>
          `,
          attachments: [{ filename: `${number}.pdf`, content: pdfBase64 }],
        });

        await supabaseAdmin.from("invoices").update({ status: "sent" }).eq("id", data.id);
        data.status = "sent";
        emailSent = true;
      } catch (emailErr) {
        console.error("Auto-send invoice email failed:", emailErr);
      }
    }

    return NextResponse.json({ invoice: data, emailSent });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to create invoice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
