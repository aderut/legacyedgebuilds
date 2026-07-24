"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setRating(5);
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  if (status === "success") {
    return (
      <div className="edge-top pt-6">
        <p className="text-gold text-sm">
          Thank you for your review! It'll appear on the site once we approve it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-gold mb-1 block">Your Name</label>
        <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl ${n <= rating ? "text-gold" : "text-gold-deep/30"}`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gold mb-1 block">Your Review</label>
        <textarea
          required
          rows={4}
          className={inputClass}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit Review"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
