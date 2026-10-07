/** Création d'un produit. @hopsyder */
import { adminCategories, adminProducts } from "@/lib/admin/data";
import { ProductEditor } from "../ProductEditor";

export const metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const [{ categories }, products] = await Promise.all([adminCategories(), adminProducts()]);
  return <ProductEditor categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} allProducts={products.map((p) => ({ slug: p.slug, name: p.name }))} />;
}
