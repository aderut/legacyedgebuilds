"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Could not update password. The reset link may have expired — request a new one.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 2000);
  }

  const inputClass =
    "w-full bg-ink border border-gold-deep/40 focus:border-gold px-4 py-3 text-sm text-ivory outline-none transition-colors";

  return (
    <section className="min-h-[80vh] flex items-center justify-center container-lg">
      <div className="w-full max-w-sm">
        <div className="eyebrow mb-3 text-center">Legacy Edge Builds</div>
        <h1 className="font-display text-2xl text-ivory mb-8 text-center">Set New Password</h1>

        {!ready && !success && (
          <p className="text-sm text-slate text-center">
            Verifying your reset link… If nothing happens after a few seconds, the
            link may have expired — go back and request a new one from the login page.
          </p>
        )}

        {ready && !success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-gold mb-1 block">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gold mb-1 block">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {success && (
          <p className="text-sm text-gold text-center">
            Password updated! Redirecting you to the dashboard…
          </p>
        )}
      </div>
    </section>
  );
}