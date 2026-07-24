"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/auth/adminFetch";
import ImageUploader from "@/components/admin/ImageUploader";
import type { GalleryItem } from "@/lib/data/db";

const galleryCategories = ["Flooring", "Wall Panels", "Marble Sheets", "Furniture Accessories", "Boards"];

export default function GalleryForm({ item }: { item?: GalleryItem }) {
  const router = useRouter();
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title || "");
  const [category, setCategory] = useState(item?.category || galleryCategories[0]);
  const [image, setImage] = useState(item?.image || "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Please upload a photo.");
      return;
    }
    setStatus("loading");
    setError("");

    const payload = { title, category, image };
    const url = isEdit ? `/api/admin/gallery/${item!.id}` : "/api/admin/gallery";
    const method = isEdit ? "PATCH" : "POST";

    const res = await adminFetch(url, { method, body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }

    router.push("/admin/gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="text-xs text-gold mb-1 block">Title</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Category</label>
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          {galleryCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Photo</label>
        <ImageUploader folder="gallery" currentUrl={image} onUploaded={setImage} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Saving..." : isEdit ? "Save Changes" : "Add Photo"}
      </button>
    </form>
  );
}
