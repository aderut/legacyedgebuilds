"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/auth/adminFetch";
import { downloadInvoicePdf, invoiceNumber, invoiceTotals, type Invoice, type InvoiceItem } from "@/lib/pdf/invoice";
import { toWhatsAppNumber } from "@/lib/utils/phone";

const statuses = ["draft", "sent", "paid"];

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminFetch(`/api/admin/invoices/${params.id}`);
    const data = await res.json();
    setInvoice(data.invoice || null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    if (!invoice) return;
    const items = invoice.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    setInvoice({ ...invoice, items });
  }

  function addItem() {
    if (!invoice) return;
    setInvoice({ ...invoice, items: [...invoice.items, { description: "", quantity: 1, unit_price: 0 }] });
  }

  function removeItem(index: number) {
    if (!invoice) return;
    setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
  }

  async function handleSave() {
    if (!invoice) return;
    await adminFetch(`/api/admin/invoices/${invoice.id}`, {
      method: "PATCH",
      body: JSON.stringify(invoice),
    });
    load();
  }

  async function handleSend() {
    if (!invoice) return;
    setSending(true);
    setSendError("");
    setSendSuccess(false);

    const res = await adminFetch(`/api/admin/invoices/${invoice.id}/send`, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setSendError(data.error || "Failed to send.");
      setSending(false);
      return;
    }

    setSendSuccess(true);
    setSending(false);
    load();
  }

  async function handleDelete() {
    if (!invoice) return;
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    await adminFetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
    router.push("/admin/invoices");
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-3 py-2 text-sm text-ivory outline-none transition-colors";

  if (loading) return <div className="container-lg py-10 text-slate text-sm">Loading…</div>;
  if (!invoice) return <div className="container-lg py-10 text-slate text-sm">Invoice not found.</div>;

  const { subtotal, tax, total } = invoiceTotals(invoice.items, invoice.tax_rate);

  return (
    <div className="container-lg py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-2">Billing</div>
          <h1 className="font-display text-3xl text-ivory">{invoiceNumber(invoice)}</h1>
        </div>
        <select
          value={invoice.status}
          onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
          className="bg-charcoal border border-gold-deep/40 text-sm text-ivory px-3 py-2 capitalize"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <div className="text-xs text-gold mb-1">Client</div>
          <div className="text-ivory">{invoice.client_name}</div>
          {invoice.client_phone && <div className="text-slate">{invoice.client_phone}</div>}
          {invoice.client_email && <div className="text-slate">{invoice.client_email}</div>}
        </div>
        {invoice.project_type && (
          <div>
            <div className="text-xs text-gold mb-1">Project Type</div>
            <div className="text-ivory">{invoice.project_type}</div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gold">Line Items</div>
          <button onClick={addItem} className="text-xs text-gold border border-gold-deep/40 px-3 py-1 hover:border-gold">
            + Add Item
          </button>
        </div>
        <div className="space-y-3">
          {invoice.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className={`${inputClass} col-span-6`}
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
              />
              <input
                type="number"
                className={`${inputClass} col-span-2`}
                value={item.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
              />
              <input
                type="number"
                className={`${inputClass} col-span-3`}
                value={item.unit_price}
                onChange={(e) => updateItem(i, { unit_price: Number(e.target.value) })}
              />
              <button onClick={() => removeItem(i)} className="col-span-1 text-red-400 text-sm">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-sm ml-auto text-sm mb-8">
        <div>
          <label className="text-xs text-gold mb-1 block">Tax Rate (%)</label>
          <input
            type="number"
            className={inputClass}
            value={invoice.tax_rate}
            onChange={(e) => setInvoice({ ...invoice, tax_rate: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-col justify-end text-right space-y-1">
          <div className="text-slate">Subtotal: NGN {subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
          <div className="text-slate">Tax: NGN {tax.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
          <div className="text-gold font-display text-lg">Total: NGN {total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="mb-8">
        <label className="text-xs text-gold mb-1 block">Notes</label>
        <textarea
          rows={3}
          className={inputClass}
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={handleSave} className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors">
          Save Changes
        </button>
        <button
          onClick={() => downloadInvoicePdf(invoice)}
          className="border border-gold text-gold px-6 py-3 text-sm hover:bg-gold hover:text-ink transition-colors"
        >
          Download PDF
        </button>
        <button
          onClick={handleSend}
          disabled={sending || !invoice.client_email}
          title={!invoice.client_email ? "Add a client email first" : undefined}
          className="border border-gold-deep/40 text-ivory/80 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
        >
          {sending ? "Sending..." : "Send by Email"}
        </button>
        {invoice.client_phone && (
          <a
            href={`https://wa.me/${toWhatsAppNumber(invoice.client_phone)}?text=${encodeURIComponent(
              `Hi ${invoice.client_name}, your invoice ${invoiceNumber(invoice)} from Legacy Edge Builds is ready. Total due: NGN ${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold-deep/40 text-ivory/80 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors"
          >
            Notify on WhatsApp
          </a>
        )}
        <button onClick={handleDelete} className="text-red-400 text-sm px-6 py-3 border border-red-400/30 hover:border-red-400 transition-colors">
          Delete
        </button>
      </div>

      {sendSuccess && <p className="text-sm text-gold">Invoice emailed successfully.</p>}
      {sendError && <p className="text-sm text-red-400">{sendError}</p>}
    </div>
  );
}
