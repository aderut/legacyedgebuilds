import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Catalogue</div>
      <h1 className="font-display text-3xl text-ivory mb-10">Add Product</h1>
      <ProductForm />
    </div>
  );
}
