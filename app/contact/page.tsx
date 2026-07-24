import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="container-lg py-20">
      <div className="eyebrow mb-3">Get in Touch</div>
      <h1 className="font-display text-4xl text-ivory mb-14">Contact</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <Suspense fallback={<div className="text-slate text-sm">Loading form…</div>}>
          <ContactForm />
        </Suspense>

        <div>
          <div className="eyebrow mb-4">Contact Details</div>
          <ul className="space-y-3 text-ivory/80 text-sm mb-10">
            <li>📞 +234 913 627 1098</li>
            <li>📧 hello@legacyedgebuilds.com</li>
            <li>📍 Lagos, Nigeria</li>
          </ul>
          <a
            href="https://wa.me/2349136271098"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gold text-gold px-8 py-3.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
          >
            🟢 Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
