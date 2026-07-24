"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  return (
    <section className="min-h-[80vh] flex items-center justify-center container-lg">
      <div className="w-full max-w-sm">
        <div className="eyebrow mb-3 text-center">Legacy Edge Builds</div>
        <h1 className="font-display text-2xl text-ivory mb-8 text-center">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-gold mb-1 block">Email</label>
            <input
              type="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gold mb-1 block">Password</label>
            <input
              type="password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
