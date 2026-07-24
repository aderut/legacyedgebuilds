"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/auth/adminFetch";
import GalleryForm from "@/components/admin/GalleryForm";
import type { GalleryItem } from "@/lib/data/db";

export default function EditGalleryItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/gallery/${params.id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Inspiration</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Edit Photo</h1>
      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && !item && <p className="text-slate text-sm">Photo not found.</p>}
      {item && <GalleryForm item={item} />}
    </div>
  );
}
