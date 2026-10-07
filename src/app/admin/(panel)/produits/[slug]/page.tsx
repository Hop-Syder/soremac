/** Édition d'un produit. @hopsyder */
import { notFound } from "next/navigation";
import { adminCategories, adminProduct, adminProducts } from "@/lib/admin/data";
import { ProductEditor } from "../ProductEditor";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ enregistre?: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: `Produit · ${(await params).slug}` };
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const [product, { categories }, products] = await Promise.all([adminProduct(slug), adminCategories(), adminProducts()]);
  if (!product) notFound();
  return (
    <ProductEditor
      key={product.slug}
      product={product}
      saved={(await searchParams).enregistre === "1"}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      allProducts={products.map((p) => ({ slug: p.slug, name: p.name }))}
    />
  );
}
