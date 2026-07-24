"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/lib/auth/adminFetch";
import type { GalleryItem } from "@/lib/data/db";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/gallery");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminFetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="container-lg py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Inspiration</div>
          <h1 className="font-display text-3xl text-ivory">Gallery</h1>
        </div>
        <Link href="/admin/gallery/new" className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors">
          + Add Photo
        </Link>
      </div>

      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && items.length === 0 && <p className="text-slate text-sm">No photos yet.</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-3 border border-gold-deep/20 bg-charcoal p-3">
            <div className="relative w-16 h-16 shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-ivory text-sm truncate">{item.title}</div>
              <div className="text-xs text-slate truncate">{item.category}</div>
            </div>
            <div className="flex gap-2 shrink-0 ml-auto">
              <Link
                href={`/admin/gallery/${item.id}`}
                className="text-sm text-gold border border-gold-deep/40 px-4 py-2 hover:border-gold transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="text-sm text-red-400 border border-red-400/30 px-4 py-2 hover:border-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
