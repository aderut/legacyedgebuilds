"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/auth/adminFetch";
import type { Review } from "@/lib/data/db";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleApproved(id: string, approved: boolean) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
    await adminFetch(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    await adminFetch("/api/admin/reviews", {
      method: "POST",
      body: JSON.stringify({ name, rating, message }),
    });
    setName("");
    setRating(5);
    setMessage("");
    setAdding(false);
    load();
  }

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Testimonials</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Reviews</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-3 mb-6">
            {(["pending", "approved", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-4 py-1.5 border capitalize transition-colors ${
                  filter === f
                    ? "bg-gold text-ink border-gold"
                    : "border-gold-deep/40 text-ivory/70 hover:border-gold hover:text-gold"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && <p className="text-slate text-sm">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="text-slate text-sm">Nothing here.</p>}

          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="border border-gold-deep/20 bg-charcoal p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-ivory text-sm">{r.name}</div>
                  <span className="text-xs uppercase text-slate border border-gold-deep/40 px-2 py-0.5">
                    {r.source}
                  </span>
                </div>
                <div className="text-gold text-sm mb-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="text-sm text-ivory/80 mb-3">{r.message}</p>
                <div className="flex gap-3">
                  {!r.approved ? (
                    <button
                      onClick={() => toggleApproved(r.id, true)}
                      className="text-xs bg-gold text-ink px-3 py-1.5 hover:bg-gold-bright"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleApproved(r.id, false)}
                      className="text-xs border border-gold-deep/40 text-ivory/70 px-3 py-1.5 hover:border-gold"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 hover:border-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl text-ivory mb-2">Add a Review</h2>
          <p className="text-xs text-slate mb-6">
            For feedback a customer sent you on WhatsApp — this goes live immediately.
          </p>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="text-xs text-gold mb-1 block">Customer Name</label>
              <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gold mb-1 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`text-2xl ${n <= rating ? "text-gold" : "text-gold-deep/30"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gold mb-1 block">What they said</label>
              <textarea required rows={4} className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
