import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";
import { buildInvoicePdf, invoiceNumber, invoiceTotals, type Invoice } from "@/lib/pdf/invoice";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invoice, error } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  if (!invoice.client_email) {
    return NextResponse.json({ error: "This invoice has no client email on file." }, { status: 400 });
  }

  try {
    const typedInvoice = invoice as Invoice;
    const doc = buildInvoicePdf(typedInvoice);
    const pdfBase64 = Buffer.from(doc.output("arraybuffer")).toString("base64");
    const { total } = invoiceTotals(typedInvoice.items, typedInvoice.tax_rate);
    const number = invoiceNumber(typedInvoice);

    await sendEmail({
      to: invoice.client_email,
      subject: `Invoice ${number} from Legacy Edge Builds`,
      html: `
        <div style="font-family: Georgia, serif; color: #0B0B0C; padding: 24px;">
          <h2 style="color: #7C5F22;">Legacy Edge Builds</h2>
          <p>Dear ${invoice.client_name},</p>
          <p>Please find attached invoice <strong>${number}</strong> for a total of
          <strong>NGN ${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</strong>.</p>
          <p>If you have any questions, feel free to reply to this email or reach us on WhatsApp.</p>
          <p style="margin-top: 24px;">Kind regards,<br/>Legacy Edge Builds</p>
        </div>
      `,
      attachments: [{ filename: `${number}.pdf`, content: pdfBase64 }],
    });

    await supabaseAdmin.from("invoices").update({ status: "sent" }).eq("id", params.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to send invoice email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
