"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/auth/adminFetch";

export default function ImageUploader({
  folder,
  currentUrl,
  onUploaded,
}: {
  folder: "products" | "gallery" | "blog" | "general";
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("loading");
    setError("");

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);

    try {
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(`Server returned an unexpected response (status ${res.status}). Check that supabase/storage.sql has been run and SUPABASE_SERVICE_ROLE_KEY is set correctly, then restart the dev server.`);
        setStatus("error");
        return;
      }

      if (!res.ok) {
        setError(data.error || `Upload failed (status ${res.status}).`);
        setStatus("error");
        return;
      }
      onUploaded(data.url!);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? `Request failed: ${err.message}` : "Request failed before reaching the server.");
      setStatus("error");
    }
  }

  return (
    <div>
      {preview && (
        <div className="relative aspect-[4/3] w-full max-w-xs border border-gold-deep/30 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="w-full text-sm text-ivory/80 file:mr-4 file:py-2 file:px-4 file:border file:border-gold file:bg-transparent file:text-gold file:text-sm"
      />
      {status === "loading" && <p className="text-xs text-slate mt-2">Uploading…</p>}
      {status === "error" && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
