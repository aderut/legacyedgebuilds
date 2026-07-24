"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/auth/adminFetch";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Product } from "@/lib/data/db";
import { categories } from "@/lib/data/db";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toLines(arr: string[]) {
  return arr.join("\n");
}
function fromLines(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(product?.category || categories[0]);
  const [image, setImage] = useState(product?.image || "");
  const [description, setDescription] = useState(product?.description || "");
  const [features, setFeatures] = useState(toLines(product?.features || []));
  const [colors, setColors] = useState(toLines(product?.colors || []));
  const [sizes, setSizes] = useState(toLines(product?.sizes || []));
  const [applications, setApplications] = useState(toLines(product?.applications || []));

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Please upload a product image.");
      return;
    }
    setStatus("loading");
    setError("");

    const payload = {
      name,
      slug,
      category,
      image,
      description,
      features: fromLines(features),
      colors: fromLines(colors),
      sizes: fromLines(sizes),
      applications: fromLines(applications),
    };

    const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await adminFetch(url, { method, body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="text-xs text-gold mb-1 block">Product Name</label>
        <input
          required
          className={inputClass}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">URL Slug</label>
        <input
          required
          className={inputClass}
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
        />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Category</label>
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Product Image</label>
        <ImageUploader folder="products" currentUrl={image} onUploaded={setImage} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Description</label>
        <textarea rows={3} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Features (one per line)</label>
        <textarea rows={4} className={inputClass} value={features} onChange={(e) => setFeatures(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gold mb-1 block">Colors (one per line)</label>
          <textarea rows={3} className={inputClass} value={colors} onChange={(e) => setColors(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gold mb-1 block">Sizes (one per line)</label>
          <textarea rows={3} className={inputClass} value={sizes} onChange={(e) => setSizes(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Applications (one per line)</label>
        <textarea rows={3} className={inputClass} value={applications} onChange={(e) => setApplications(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}
