import GalleryFilter from "@/components/GalleryFilter";
import { getGalleryItems } from "@/lib/data/db";

export const revalidate = 0;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <section className="container-lg py-20">
      <div className="eyebrow mb-3">Inspiration</div>
      <h1 className="font-display text-4xl text-ivory mb-4">Gallery</h1>
      <p className="text-slate max-w-xl mb-10">
        Browse real interiors finished with our materials — living rooms, bedrooms,
        offices, hotels, and kitchens.
      </p>

      <GalleryFilter items={items} />
    </section>
  );
}
