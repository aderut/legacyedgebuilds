"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/auth/adminFetch";
import { invoiceTotals, type InvoiceItem } from "@/lib/pdf/invoice";

type EnquiryOption = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  project_type: string | null;
};

export default function InvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEnquiryId = searchParams.get("enquiryId") || "";

  const [enquiries, setEnquiries] = useState<EnquiryOption[]>([]);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(prefillEnquiryId);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unit_price: 0 }]);

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/enquiries")
      .then((res) => res.json())
      .then((data) => {
        const list = data.enquiries || [];
        setEnquiries(list);
        if (prefillEnquiryId) {
          const e = list.find((en: EnquiryOption) => en.id === prefillEnquiryId);
          if (e) {
            setClientName(e.name);
            setClientEmail(e.email || "");
            setClientPhone(e.phone);
            setProjectType(e.project_type || "");
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadFromEnquiry(id: string) {
    setSelectedEnquiryId(id);
    const e = enquiries.find((en) => en.id === id);
    if (e) {
      setClientName(e.name);
      setClientEmail(e.email || "");
      setClientPhone(e.phone);
      setProjectType(e.project_type || "");
    }
  }

  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const { subtotal, tax, total } = invoiceTotals(items, taxRate);

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim()) {
      setError("Client name is required.");
      return;
    }
    const cleanItems = items.filter((it) => it.description.trim());
    if (cleanItems.length === 0) {
      setError("Add at least one line item.");
      return;
    }

    setStatus("loading");
    setError("");

    const res = await adminFetch("/api/admin/invoices", {
      method: "POST",
      body: JSON.stringify({
        enquiry_id: selectedEnquiryId || null,
        client_name: clientName,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        project_type: projectType || null,
        items: cleanItems,
        tax_rate: taxRate,
        notes,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }

    router.push(`/admin/invoices/${data.invoice.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {enquiries.length > 0 && (
        <div>
          <label className="text-xs text-gold mb-1 block">Load client from an existing quote (optional)</label>
          <select
            className={inputClass}
            value={selectedEnquiryId}
            onChange={(e) => loadFromEnquiry(e.target.value)}
          >
            <option value="">— Start from scratch —</option>
            {enquiries.map((e) => (
              <option key={e.id} value={e.id}>{e.name} — {e.phone}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gold mb-1 block">Client Name</label>
          <input required className={inputClass} value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gold mb-1 block">Client Email</label>
          <input type="email" className={inputClass} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gold mb-1 block">Client Phone</label>
          <input className={inputClass} value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gold mb-1 block">Project Type</label>
          <input className={inputClass} value={projectType} onChange={(e) => setProjectType(e.target.value)} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs text-gold block">Line Items</label>
          <button type="button" onClick={addItem} className="text-xs text-gold border border-gold-deep/40 px-3 py-1 hover:border-gold">
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <input
                placeholder="Description"
                className={`${inputClass} col-span-6`}
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
              />
              <input
                type="number"
                min={0}
                placeholder="Qty"
                className={`${inputClass} col-span-2`}
                value={item.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                placeholder="Unit Price (NGN)"
                className={`${inputClass} col-span-3`}
                value={item.unit_price}
                onChange={(e) => updateItem(i, { unit_price: Number(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="col-span-1 text-red-400 text-sm h-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-sm ml-auto text-sm">
        <div>
          <label className="text-xs text-gold mb-1 block">Tax Rate (%)</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col justify-end text-right space-y-1">
          <div className="text-slate">Subtotal: NGN {subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
          <div className="text-slate">Tax: NGN {tax.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
          <div className="text-gold font-display text-lg">Total: NGN {total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Notes (optional)</label>
        <textarea rows={3} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Saving..." : "Create Invoice"}
      </button>
    </form>
  );
}
