"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/data/db";

export default function ProductsFilter({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-12">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-sm px-5 py-2 border transition-colors ${
              active === cat
                ? "bg-gold text-ink border-gold"
                : "border-gold-deep/40 text-ivory/70 hover:border-gold hover:text-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate text-sm col-span-full">No products in this category yet.</p>
        )}
      </div>
    </>
  );
}
