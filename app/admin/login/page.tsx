"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "reset">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
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

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Something went wrong sending the reset email. Try again.");
      return;
    }

    setResetSent(true);
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  return (
    <section className="min-h-[80vh] flex items-center justify-center container-lg">
      <div className="w-full max-w-sm">
        <div className="eyebrow mb-3 text-center">Legacy Edge Builds</div>
        <h1 className="font-display text-2xl text-ivory mb-8 text-center">
          {mode === "signin" ? "Admin Login" : "Reset Password"}
        </h1>

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-5">
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

            <button
              type="button"
              onClick={() => {
                setMode("reset");
                setError("");
                setResetSent(false);
              }}
              className="w-full text-xs text-slate hover:text-gold text-center"
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === "reset" && (
          <div className="space-y-5">
            {resetSent ? (
              <p className="text-sm text-gold text-center">
                Check your email for a link to reset your password. It may take a
                minute to arrive.
              </p>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-5">
                <p className="text-xs text-slate text-center mb-2">
                  Enter your admin email and we&apos;ll send you a link to set a new password.
                </p>
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

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setResetSent(false);
              }}
              className="w-full text-xs text-slate hover:text-gold text-center"
            >
              ← Back to sign in
            </button>
          </div>
        )}
      </div>
    </section>
  );
}