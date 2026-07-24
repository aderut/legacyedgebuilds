"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Quotes / Enquiries" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/reset-password";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setAuthed(true);
      }
      setChecked(true);
    });
  }, [isLoginPage, router]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) return <>{children}</>;

  if (!checked) {
    return (
      <div className="container-lg py-20 text-slate text-sm">Checking session…</div>
    );
  }

  if (!authed) return null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm px-3 py-2 rounded-sm transition-colors ${
            pathname === item.href
              ? "bg-gold text-ink"
              : "text-ivory/70 hover:text-gold"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleSignOut}
        className="text-sm px-3 py-2 text-left text-ivory/50 hover:text-gold mt-4"
      >
        Sign Out
      </button>
      <Link href="/" className="text-sm px-3 py-2 text-ivory/50 hover:text-gold">
        ← Back to site
      </Link>
    </nav>
  );

  return (
    <div className="md:flex md:min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-gold-deep/20 bg-charcoal px-5 py-4">
        <div className="font-display text-lg text-ivory">
          Legacy <span className="text-gold">Edge</span> Admin
        </div>
        <button
          aria-label="Toggle admin menu"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="text-ivory"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[65px] z-30 border-b border-gold-deep/20 bg-charcoal px-5 py-4">
          {navLinks}
        </div>
      )}

      {/* Desktop sidebar — sticky, fixed to viewport height, never scrolls with page content */}
      <aside className="hidden md:block md:w-56 md:shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto border-r border-gold-deep/20 bg-charcoal px-6 py-8">
        <div className="font-display text-lg text-ivory mb-8">
          Legacy <span className="text-gold">Edge</span> Admin
        </div>
        {navLinks}
      </aside>

      <main className="flex-1 min-w-0 bg-ink">{children}</main>
    </div>
  );
}
