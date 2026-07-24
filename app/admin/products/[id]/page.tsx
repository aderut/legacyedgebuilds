"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/auth/adminFetch";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/lib/data/db";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product || null))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Catalogue</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Edit Product</h1>
      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && !product && <p className="text-slate text-sm">Product not found.</p>}
      {product && <ProductForm product={product} />}
    </div>
  );
}
