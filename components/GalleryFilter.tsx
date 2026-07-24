"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { GalleryItem } from "@/lib/data/db";

const filters = ["All", "Flooring", "Wall Panels", "Marble Sheets", "Furniture Accessories", "Boards"];

export default function GalleryFilter({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((g) => g.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`text-sm px-5 py-2 border transition-colors ${
              active === f
                ? "bg-gold text-ink border-gold"
                : "border-gold-deep/40 text-ivory/70 hover:border-gold hover:text-gold"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
        {filtered.map((item, i) => (
          <Reveal key={item.id} delay={(i % 6) * 70} className="break-inside-avoid">
            <div className="relative group overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={450}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-ivory text-sm font-display">{item.title}</span>
              </div>
            </div>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate text-sm">No photos in this category yet.</p>
        )}
      </div>
    </>
  );
}
