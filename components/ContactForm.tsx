"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const projectTypes = ["Residential", "Office", "Hotel", "Retail / Commercial", "Other"];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: projectTypes[0],
    preferredSize: "",
    preferredColor: "",
    message: productSlug ? `I'm interested in ${productSlug.replace(/-/g, " ")}.` : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", phone: "", email: "", projectType: projectTypes[0], preferredSize: "", preferredColor: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-gold mb-1 block">Name</label>
        <input
          required
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-gold mb-1 block">Phone Number</label>
        <input
          required
          className={inputClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-gold mb-1 block">Email</label>
        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-gold mb-1 block">Project Type</label>
        <select
          className={inputClass}
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          {projectTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gold mb-1 block">Preferred Size</label>
          <input
            placeholder="e.g. 1220mm x 2440mm"
            className={inputClass}
            value={form.preferredSize}
            onChange={(e) => setForm({ ...form, preferredSize: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gold mb-1 block">Preferred Color</label>
          <input
            placeholder="e.g. Walnut Brown"
            className={inputClass}
            value={form.preferredColor}
            onChange={(e) => setForm({ ...form, preferredColor: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gold mb-1 block">Message</label>
        <textarea
          required
          rows={4}
          className={inputClass}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-gold">Thank you — we&apos;ll be in touch shortly.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try WhatsApp instead.</p>
      )}
    </form>
  );
}
