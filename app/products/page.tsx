import ProductsFilter from "@/components/ProductsFilter";
import { categories, getProducts } from "@/lib/data/db";

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="container-lg py-20">
      <div className="eyebrow mb-3">Catalogue</div>
      <h1 className="font-display text-4xl text-ivory mb-4">Products We Supply</h1>
      <p className="text-slate max-w-xl mb-10">
        Browse flooring, wall solutions, boards, and furniture accessories — all sourced
        for durability and finish quality.
      </p>

      <ProductsFilter products={products} categories={categories} />
    </section>
  );
}
