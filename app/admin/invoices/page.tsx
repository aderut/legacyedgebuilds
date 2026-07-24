"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/auth/adminFetch";
import { invoiceNumber, invoiceTotals, type Invoice } from "@/lib/pdf/invoice";

const statusColors: Record<string, string> = {
  draft: "text-slate border-gold-deep/40",
  sent: "text-gold border-gold/60",
  paid: "text-green-400 border-green-400/40",
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-lg py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Billing</div>
          <h1 className="font-display text-3xl text-ivory">Invoices</h1>
        </div>
        <Link href="/admin/invoices/new" className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors">
          + New Invoice
        </Link>
      </div>

      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && invoices.length === 0 && <p className="text-slate text-sm">No invoices yet.</p>}

      <div className="space-y-3">
        {invoices.map((inv) => {
          const { total } = invoiceTotals(inv.items, inv.tax_rate);
          return (
            <Link
              key={inv.id}
              href={`/admin/invoices/${inv.id}`}
              className="flex flex-wrap items-center justify-between gap-3 border border-gold-deep/20 bg-charcoal p-4 hover:border-gold/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-ivory text-sm truncate">{invoiceNumber(inv)} — {inv.client_name}</div>
                <div className="text-xs text-slate mt-1 truncate">
                  {new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {" • "}NGN {total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className={`text-xs uppercase border px-2 py-1 shrink-0 ${statusColors[inv.status] || ""}`}>
                {inv.status}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
