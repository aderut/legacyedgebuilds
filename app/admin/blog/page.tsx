"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/lib/auth/adminFetch";
import type { BlogPost } from "@/lib/data/db";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container-lg py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Resources</div>
          <h1 className="font-display text-3xl text-ivory">Blog</h1>
        </div>
        <Link href="/admin/blog/new" className="bg-gold text-ink px-6 py-3 text-sm hover:bg-gold-bright transition-colors">
          + Add Post
        </Link>
      </div>

      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && posts.length === 0 && <p className="text-slate text-sm">No posts yet.</p>}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center gap-3 border border-gold-deep/20 bg-charcoal p-3">
            <div className="relative w-16 h-16 shrink-0">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-ivory text-sm truncate">{post.title}</div>
              <div className="text-xs text-slate truncate">
                {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-auto">
              <Link
                href={`/admin/blog/${post.id}`}
                className="text-sm text-gold border border-gold-deep/40 px-4 py-2 hover:border-gold transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
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
