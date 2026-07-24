"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/auth/adminFetch";
import type { Enquiry } from "@/lib/pdf/generateQuotePdf";

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/enquiries")
      .then((res) => res.json())
      .then((data) => setEnquiries(data.enquiries || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Enquiries", value: enquiries.length },
    { label: "New", value: enquiries.filter((e) => e.status === "new").length },
    { label: "Contacted", value: enquiries.filter((e) => e.status === "contacted").length },
    { label: "Won", value: enquiries.filter((e) => e.status === "won").length },
  ];

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Overview</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
        {stats.map((s) => (
          <div key={s.label} className="edge-top pt-5 bg-charcoal p-5">
            <div className="text-3xl font-display text-gold mb-1">
              {loading ? "—" : s.value}
            </div>
            <div className="text-xs text-slate">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-ivory">Recent Enquiries</h2>
        <Link href="/admin/enquiries" className="text-sm text-gold border-b border-gold/40 hover:border-gold">
          View All →
        </Link>
      </div>

      <div className="border border-gold-deep/20">
        {loading && <div className="p-6 text-slate text-sm">Loading…</div>}
        {!loading && enquiries.length === 0 && (
          <div className="p-6 text-slate text-sm">No enquiries yet.</div>
        )}
        {enquiries.slice(0, 5).map((e) => (
          <div key={e.id} className="flex items-center justify-between p-4 border-b border-gold-deep/10 last:border-b-0">
            <div>
              <div className="text-ivory text-sm">{e.name}</div>
              <div className="text-slate text-xs">{e.phone} • {e.project_type || "—"}</div>
            </div>
            <span className="text-xs uppercase text-gold border border-gold-deep/40 px-2 py-1">
              {e.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
