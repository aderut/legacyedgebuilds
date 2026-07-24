import GalleryForm from "@/components/admin/GalleryForm";

export default function NewGalleryItemPage() {
  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Inspiration</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Add Photo</h1>
      <GalleryForm />
    </div>
  );
}
