"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/auth/adminFetch";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/lib/data/db";

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`/api/admin/blog/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post || null))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Resources</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Edit Post</h1>
      {loading && <p className="text-slate text-sm">Loading…</p>}
      {!loading && !post && <p className="text-slate text-sm">Post not found.</p>}
      {post && <BlogForm post={post} />}
    </div>
  );
}
