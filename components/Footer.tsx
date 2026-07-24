import Link from "next/link";

export default function Footer() {
  return (
    <footer className="edge-top bg-charcoal mt-24">
      <div className="container-lg py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-xl text-ivory mb-3">
            Legacy <span className="text-gold">Edge</span> Builds
          </div>
          <p className="text-sm text-slate italic">
            Quality Materials. Beautiful Spaces. Lasting Legacy.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/products" className="hover:text-gold">Products</Link></li>
            <li><Link href="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link href="/blog" className="hover:text-gold">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li>📞 +234 913 627 1098</li>
            <li>📧 hello@legacyedgebuilds.com</li>
            <li>📍 Lagos, Nigeria</li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Follow Us</div>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><a href="https://www.instagram.com/legacyedgebuilds?utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a></li>
            <li><a href="#" className="hover:text-gold">Facebook</a></li>
            <li><a href="https://www.tiktok.com/@legacyedgebuilds?_r=1&_t=ZS-97odEctfClD" target="_blank" rel="noopener noreferrer" className="hover:text-gold">TikTok</a></li>
            <li><a href="https://wa.me/2349136271098" target="_blank" rel="noopener noreferrer" className="hover:text-gold">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-deep/20">
        <div className="container-lg py-6 text-xs text-slate flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Legacy Edge Builds. All rights reserved.</span>
          <span>Nationwide delivery across Nigeria.</span>
        </div>
      </div>
    </footer>
  );
}
