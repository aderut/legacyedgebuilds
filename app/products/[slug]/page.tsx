import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/db";

export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <section className="container-lg py-20">
      <div className="text-sm text-slate mb-8">
        <Link href="/products" className="hover:text-gold">Products</Link> / {product.name}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div className="relative aspect-[4/3]">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div>
          <div className="eyebrow mb-3">{product.category}</div>
          <h1 className="font-display text-3xl text-ivory mb-6">{product.name}</h1>
          <p className="text-slate leading-relaxed mb-8">{product.description}</p>

          <div className="mb-6">
            <div className="text-sm text-gold mb-2">Features</div>
            <ul className="text-sm text-ivory/80 space-y-1">
              {product.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </div>

          <div className="mb-10">
            <div className="text-sm text-gold mb-2">Applications</div>
            <div className="flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <span key={a} className="text-xs border border-gold-deep/40 text-ivory/70 px-3 py-1">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href={`/contact?product=${product.slug}`} className="bg-gold text-ink px-8 py-3.5 text-sm tracking-wide hover:bg-gold-bright transition-colors">
              Request Quote
            </Link>
            <a
              href={`https://wa.me/2349136271098?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold text-gold px-8 py-3.5 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
