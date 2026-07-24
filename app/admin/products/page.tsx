"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/lib/auth/adminFetch";
import type { Product } from "@/lib/data/db";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container-lg py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Catalogue</div>
          <h1 className="font-display text-3xl text-ivory">Products</h1>
        </div>
        <Link href="/admin/products/new" className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors">
          + Add Product
        </Link>
      </div>

      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && products.length === 0 && <p className="text-slate text-sm">No products yet.</p>}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 border border-gold-deep/20 bg-charcoal p-3">
            <div className="relative w-16 h-16 shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-ivory text-sm truncate">{p.name}</div>
              <div className="text-xs text-slate truncate">{p.category} • /{p.slug}</div>
            </div>
            <div className="flex gap-2 shrink-0 ml-auto">
              <Link
                href={`/admin/products/${p.id}`}
                className="text-sm text-gold border border-gold-deep/40 px-4 py-2 hover:border-gold transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p.id, p.name)}
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
