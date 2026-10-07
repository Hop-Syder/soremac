/**
 * Catégories (TDR §44) : créer, modifier, réorganiser.
 * @hopsyder
 */
import { adminCategories, adminProducts } from "@/lib/admin/data";
import { CategoryEditor } from "./CategoryEditor";
import { CategoryRowActions } from "./CategoryRowActions";

export const metadata = { title: "Catégories" };

export default async function CategoriesPage() {
  const [{ categories }, products] = await Promise.all([adminCategories(), adminProducts()]);
  const count = (slug: string) => products.filter((p) => p.category === slug && p.status !== "archived").length;
  const all = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase">Catégories</h1>
          <p className="mt-1 text-sm text-steel">L'ordre ci-dessous est celui de la homepage, du catalogue et du footer.</p>
        </div>
      </div>

      <details className="border border-dashed border-ink/30 bg-white">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold">+ Nouvelle catégorie</summary>
        <div className="border-t border-line p-5"><CategoryEditor all={all} /></div>
      </details>

      <ol className="grid gap-2">
        {categories.map((c, i) => (
          <li key={c.slug} className="border border-line bg-white">
            <details>
              <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="tabular w-6 text-sm text-steel">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="block truncate text-xs text-steel">/produits/{c.slug} · {count(c.slug)} produit(s) · tuile {c.size.toUpperCase()}</span>
                </span>
                <CategoryRowActions slug={c.slug} first={i === 0} last={i === categories.length - 1} />
              </summary>
              <div className="border-t border-line p-5"><CategoryEditor category={c} all={all} /></div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
