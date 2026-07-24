"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold-deep/30">
      <div className="container-lg flex items-center justify-between h-20">
        <Link href="/" className="font-display text-xl tracking-wide text-ivory">
          Legacy <span className="text-gold">Edge</span> Builds
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ivory/80 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm border border-gold text-gold px-5 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            Get a Quote
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden text-ivory"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gold-deep/30 bg-ink animate-hero-1">
          <div className="container-lg flex flex-col py-4 gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-ivory/80 hover:text-gold text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-sm border border-gold text-gold px-5 py-2 text-center hover:bg-gold hover:text-ink transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
