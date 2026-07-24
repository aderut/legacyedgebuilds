import jsPDF from "jspdf";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  project_type: string | null;
  preferred_size?: string | null;
  preferred_color?: string | null;
  message: string;
  status: string;
  created_at: string;
};

export function generateQuotePdf(enquiry: Enquiry) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const gold: [number, number, number] = [201, 162, 75];
  const ink: [number, number, number] = [11, 11, 12];

  // Header band
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

  // Title
  let y = 130;
  doc.setTextColor(...ink);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("Quote Request", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  y += 20;
  doc.text(`Reference: ${enquiry.id.slice(0, 8).toUpperCase()}`, margin, y);
  y += 15;
  doc.text(`Date: ${new Date(enquiry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, margin, y);
  y += 15;
  doc.text(`Status: ${enquiry.status.toUpperCase()}`, margin, y);

  // Divider
  y += 20;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);

  // Client details
  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  doc.text("Client Details", margin, y);

  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const details = [
    ["Name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Email", enquiry.email || "—"],
    ["Project Type", enquiry.project_type || "—"],
    ["Preferred Size", enquiry.preferred_size || "—"],
    ["Preferred Color", enquiry.preferred_color || "—"],
  ];
  details.forEach(([label, value]) => {
    doc.setTextColor(120, 120, 120);
    doc.text(`${label}:`, margin, y);
    doc.setTextColor(...ink);
    doc.text(value, margin + 100, y);
    y += 18;
  });

  // Message
  y += 15;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Message", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const lines = doc.splitTextToSize(enquiry.message, pageWidth - margin * 2);
  doc.text(lines, margin, y);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...gold);
  doc.line(margin, pageHeight - 60, pageWidth - margin, pageHeight - 60);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Legacy Edge Builds  •  hello@legacyedgebuilds.com  •  +234 913 627 1098  •  Lagos, Nigeria",
    margin,
    pageHeight - 40
  );

  doc.save(`quote-${enquiry.name.replace(/\s+/g, "-").toLowerCase()}-${enquiry.id.slice(0, 8)}.pdf`);
}
