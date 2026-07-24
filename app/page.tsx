import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { categories, getApprovedReviews, getProducts } from "@/lib/data/db";

export const revalidate = 0;

const whyChooseUs = [
  {
    icon: "◆",
    title: "Premium Quality Materials",
    text: "Every product is sourced and tested to hold up in real Nigerian homes and commercial spaces.",
  },
  {
    icon: "◇",
    title: "Durable & Reliable Products",
    text: "Built for daily use — from high-traffic flooring to hardware rated for years of service.",
  },
  {
    icon: "✦",
    title: "Luxury Finishes",
    text: "Black-and-gold, marble, and matte textures that give spaces a distinctly premium feel.",
  },
  {
    icon: "⟡",
    title: "Trusted Customer Service",
    text: "From first enquiry to final delivery, our team stays with you through the project.",
  },
];

const galleryCategories = ["Living Rooms", "Bedrooms", "Offices", "Hotels", "Kitchens"];

const galleryImages: Record<string, string> = {
  "Living Rooms": "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200",
  "Bedrooms": "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200",
  "Offices": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
  "Hotels": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200",
  "Kitchens": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200",
};

const deliveryCities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "And more"];

export default async function HomePage() {
  const products = await getProducts();
  const reviews = await getApprovedReviews(6);
  return (
    <>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920"
          alt="Luxury living room with black and gold accents"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="container-lg relative z-10">
          <div className="eyebrow mb-4 animate-hero-1">Premium Interior Materials Supplier</div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-ivory max-w-3xl animate-hero-2">
            Premium Interior Materials for Exceptional Spaces
          </h1>
          <p className="text-ivory/80 mt-6 max-w-xl text-lg animate-hero-3">
            From flooring to wall finishes, we supply quality materials that transform
            homes, offices, hotels, and commercial spaces.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 animate-hero-4">
            <Link href="/products" className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors">
              View Products
            </Link>
            <Link href="/contact" className="border border-gold text-gold px-8 py-3.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container-lg py-24">
        <Reveal>
          <div className="eyebrow mb-3">Why Legacy Edge Builds</div>
          <h2 className="font-display text-3xl text-ivory mb-14 max-w-xl">
            Built for spaces that need to last
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="edge-top pt-6">
                <div className="text-gold text-2xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg text-ivory mb-2">{item.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Products We Supply */}
      <section className="bg-charcoal/40 py-24">
        <div className="container-lg">
          <Reveal>
            <div className="eyebrow mb-3">Products We Supply</div>
            <h2 className="font-display text-3xl text-ivory mb-14 max-w-xl">
              Materials for every finish
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const example = products.find((p) => p.category === cat);
              if (!example) return null;
              return (
                <Reveal key={cat} delay={i * 100}>
                  <ProductCard product={example} />
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10">
            <Link href="/products" className="text-gold border-b border-gold/40 hover:border-gold pb-0.5 text-sm">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects / Inspiration Gallery */}
      <section className="container-lg py-24">
        <Reveal>
          <div className="eyebrow mb-3">Inspiration</div>
          <h2 className="font-display text-3xl text-ivory mb-14 max-w-xl">
            Featured Projects
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryCategories.map((cat, i) => (
            <Reveal key={cat} delay={i * 80}>
              <Link
                href="/gallery"
                className="relative aspect-[4/3] overflow-hidden group block"
              >
                <Image
                  src={galleryImages[cat]}
                  alt={cat}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/20 transition-colors" />
                <span className="absolute bottom-4 left-4 font-display text-ivory text-lg">{cat}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="bg-charcoal/40 py-24">
        <div className="container-lg grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="eyebrow mb-3">Our Story</div>
            <h2 className="font-display text-3xl text-ivory mb-6">About Legacy Edge Builds</h2>
            <p className="text-slate leading-relaxed mb-6">
              Legacy Edge Builds supplies premium interior finishing materials designed to
              help homeowners, contractors, architects, and designers create beautiful
              spaces that stand the test of time.
            </p>
            <Link href="/about" className="text-gold border-b border-gold/40 hover:border-gold pb-0.5 text-sm">
              Learn More About Us →
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
                alt="Legacy Edge Builds office"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-lg py-24">
        <Reveal>
          <div className="eyebrow mb-3">Testimonials</div>
          <h2 className="font-display text-3xl text-ivory mb-14 max-w-xl">
            What our clients say
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <div className="edge-top pt-6 bg-charcoal p-6">
                <div className="text-gold mb-3 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="text-sm text-ivory/80 leading-relaxed mb-4">&ldquo;{r.message}&rdquo;</p>
                <div className="text-xs text-slate">— {r.name}</div>
              </div>
            </Reveal>
          ))}
          {reviews.length === 0 && (
            <p className="text-slate text-sm col-span-full">
              No reviews yet.{" "}
              <Link href="/reviews" className="text-gold border-b border-gold/40 hover:border-gold">
                Be the first to leave one →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Delivery */}
      <section className="bg-charcoal/40 py-24">
        <div className="container-lg grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="eyebrow mb-3">Nationwide Delivery</div>
            <h2 className="font-display text-3xl text-ivory mb-6">We Deliver Nationwide</h2>
            <ul className="grid grid-cols-2 gap-3 text-ivory/80 text-sm">
              {deliveryCities.map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <span className="text-gold">—</span> {city}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="95" fill="none" stroke="#7C5F22" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#7C5F22" strokeWidth="1" />
                <path
                  d="M70 40 L140 50 L155 100 L130 150 L90 160 L55 130 L45 80 Z"
                  fill="#161418"
                  stroke="#C9A24B"
                  strokeWidth="1.5"
                />
                <circle cx="90" cy="90" r="3" fill="#E8CD84">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="110" cy="70" r="3" fill="#E8CD84">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="120" r="3" fill="#E8CD84">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="120" cy="110" r="3" fill="#E8CD84">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="edge-top bg-ink py-24 text-center">
        <Reveal className="container-lg">
          <h2 className="font-display text-3xl md:text-4xl text-ivory mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-slate mb-10 max-w-xl mx-auto">
            Get premium interior materials delivered to your doorstep.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors">
              Request Quote
            </Link>
            <a
              href="https://wa.me/2349136271098"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold text-gold px-8 py-3.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
