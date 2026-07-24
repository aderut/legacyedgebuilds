"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/auth/adminFetch";
import ImageUploader from "@/components/admin/ImageUploader";
import type { BlogPost } from "@/lib/data/db";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [image, setImage] = useState(post?.image || "");
  const [date, setDate] = useState(post?.date || new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState((post?.content || []).join("\n\n"));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Please upload a cover image.");
      return;
    }
    setStatus("loading");
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      image,
      date,
      content: content.split("\n\n").map((p) => p.trim()).filter(Boolean),
    };

    const url = isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await adminFetch(url, { method, body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="text-xs text-gold mb-1 block">Title</label>
        <input
          required
          className={inputClass}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
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
        <label className="text-xs text-gold mb-1 block">Date</label>
        <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Cover Image</label>
        <ImageUploader folder="blog" currentUrl={image} onUploaded={setImage} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Excerpt</label>
        <textarea rows={2} className={inputClass} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Content (separate paragraphs with a blank line)</label>
        <textarea rows={10} className={inputClass} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
      </button>
    </form>
  );
}
