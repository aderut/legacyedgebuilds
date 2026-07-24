"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/auth/adminFetch";
import { generateQuotePdf, type Enquiry } from "@/lib/pdf/generateQuotePdf";
import { toWhatsAppNumber } from "@/lib/utils/phone";

const statuses = ["new", "contacted", "won", "lost"];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/enquiries");
    const data = await res.json();
    setEnquiries(data.enquiries || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await adminFetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  const filtered = filter === "All" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Quotes</div>
      <h1 className="font-display text-3xl text-ivory mb-8">Quote Requests</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-1.5 border capitalize transition-colors ${
              filter === s
                ? "bg-gold text-ink border-gold"
                : "border-gold-deep/40 text-ivory/70 hover:border-gold hover:text-gold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && filtered.length === 0 && <p className="text-slate text-sm">No enquiries match this filter.</p>}

      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="border border-gold-deep/20 bg-charcoal">
            <button
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div>
                <div className="text-ivory text-sm">{e.name} <span className="text-slate">— {e.phone}</span></div>
                <div className="text-xs text-slate mt-1">
                  {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {" • "}{e.project_type || "—"}
                </div>
              </div>
              <span className="text-xs uppercase text-gold border border-gold-deep/40 px-2 py-1">{e.status}</span>
            </button>

            {expanded === e.id && (
              <div className="border-t border-gold-deep/20 p-4 space-y-4">
                <p className="text-sm text-ivory/80 leading-relaxed">{e.message}</p>
                {(e.preferred_size || e.preferred_color) && (
                  <div className="flex gap-6 text-xs text-slate">
                    {e.preferred_size && <span><span className="text-gold">Size:</span> {e.preferred_size}</span>}
                    {e.preferred_color && <span><span className="text-gold">Color:</span> {e.preferred_color}</span>}
                  </div>
                )}
                <div className="text-xs text-slate">Email: {e.email || "—"}</div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value)}
                    className="bg-ink border border-gold-deep/40 text-sm text-ivory px-3 py-2 capitalize"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => generateQuotePdf(e)}
                    className="text-sm bg-gold text-ink px-5 py-2 hover:bg-gold-bright transition-colors"
                  >
                    Download PDF
                  </button>

                  <Link
                    href={`/admin/invoices/new?enquiryId=${e.id}`}
                    className="text-sm border border-gold text-gold px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
                  >
                    Create Invoice
                  </Link>

                  <a
                    href={`https://wa.me/${toWhatsAppNumber(e.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm border border-gold text-gold px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
                  >
                    WhatsApp Client
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
