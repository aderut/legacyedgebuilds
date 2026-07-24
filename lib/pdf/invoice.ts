import jsPDF from "jspdf";

export type InvoiceItem = {
  description: string;
  quantity: number;
  unit_price: number;
};

export type Invoice = {
  id: string;
  invoice_seq: number;
  enquiry_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  project_type: string | null;
  items: InvoiceItem[];
  tax_rate: number;
  notes: string;
  status: string;
  created_at: string;
};

export function invoiceNumber(invoice: Pick<Invoice, "invoice_seq">) {
  return `INV-${String(invoice.invoice_seq).padStart(4, "0")}`;
}

export function invoiceTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function formatNaira(amount: number) {
  return `NGN ${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Builds the branded invoice PDF. Returns the jsPDF instance so callers can
 * either .save() it in the browser or pull base64 output for emailing.
 */
export function buildInvoicePdf(invoice: Invoice): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const gold: [number, number, number] = [201, 162, 75];
  const ink: [number, number, number] = [11, 11, 12];

  doc.setFillColor(...ink);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.line(0, 90, pageWidth, 90);

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text("Legacy Edge Builds", margin, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text("Quality Materials. Beautiful Spaces. Lasting Legacy.", margin, 65);

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", pageWidth - margin, 45, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(invoiceNumber(invoice), pageWidth - margin, 65, { align: "right" });

  let y = 130;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Billed To", margin, y);
  doc.text("Date", pageWidth - margin - 150, y);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(invoice.client_name, margin, y);
  doc.text(
    new Date(invoice.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    pageWidth - margin - 150,
    y
  );

  if (invoice.client_phone) {
    y += 16;
    doc.text(invoice.client_phone, margin, y);
  }
  if (invoice.client_email) {
    y += 16;
    doc.text(invoice.client_email, margin, y);
  }
  if (invoice.project_type) {
    y += 16;
    doc.setTextColor(120, 120, 120);
    doc.text(`Project: ${invoice.project_type}`, margin, y);
    doc.setTextColor(...ink);
  }

  y += 30;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);

  // Table header
  y += 25;
  const colDesc = margin;
  const colQty = margin + 260;
  const colPrice = margin + 380;
  const colTotal = pageWidth - margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("DESCRIPTION", colDesc, y);
  doc.text("QTY", colQty, y, { align: "right" });
  doc.text("UNIT PRICE", colPrice, y, { align: "right" });
  doc.text("AMOUNT", colTotal, y, { align: "right" });

  y += 8;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, pageWidth - margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...ink);

  invoice.items.forEach((item) => {
    y += 22;
    const lines = doc.splitTextToSize(item.description, colQty - colDesc - 20);
    doc.text(lines, colDesc, y);
    doc.text(String(item.quantity), colQty, y, { align: "right" });
    doc.text(formatNaira(item.unit_price), colPrice, y, { align: "right" });
    doc.text(formatNaira(item.quantity * item.unit_price), colTotal, y, { align: "right" });
    y += (lines.length - 1) * 14;
  });

  y += 15;
  doc.setDrawColor(...gold);
  doc.line(margin, y, pageWidth - margin, y);

  const { subtotal, tax, total } = invoiceTotals(invoice.items, invoice.tax_rate);

  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Subtotal", colPrice, y, { align: "right" });
  doc.setTextColor(...ink);
  doc.text(formatNaira(subtotal), colTotal, y, { align: "right" });

  if (invoice.tax_rate > 0) {
    y += 18;
    doc.setTextColor(120, 120, 120);
    doc.text(`Tax (${invoice.tax_rate}%)`, colPrice, y, { align: "right" });
    doc.setTextColor(...ink);
    doc.text(formatNaira(tax), colTotal, y, { align: "right" });
  }

  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total Due", colPrice, y, { align: "right" });
  doc.text(formatNaira(total), colTotal, y, { align: "right" });

  if (invoice.notes) {
    y += 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    doc.text("Notes", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, y);
  }

  doc.setDrawColor(...gold);
  doc.line(margin, pageHeight - 60, pageWidth - margin, pageHeight - 60);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Legacy Edge Builds  •  hello@legacyedgebuilds.com  •  +234 913 627 1098  •  Lagos, Nigeria",
    margin,
    pageHeight - 40
  );

  return doc;
}

export function downloadInvoicePdf(invoice: Invoice) {
  const doc = buildInvoicePdf(invoice);
  doc.save(`${invoiceNumber(invoice)}-${invoice.client_name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
