import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/db";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-charcoal border border-gold-deep/20 hover:border-gold/60 transition-colors">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="eyebrow mb-1">{product.category}</div>
        <h3 className="font-display text-lg text-ivory mb-3">{product.name}</h3>
        <Link
          href={`/products/${product.slug}`}
          className="text-sm text-gold border-b border-gold/40 hover:border-gold pb-0.5"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
