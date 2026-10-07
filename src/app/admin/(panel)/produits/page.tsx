/**
 * Liste des produits : recherche, filtres statut/catégorie, mises en avant en un clic.
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminCategories, adminProducts } from "@/lib/admin/data";
import { normalize } from "@/lib/catalog/search";
import { productUrl } from "@/lib/catalog/products";
import { StatusBadge } from "@/components/admin/ui";
import { buttonClass } from "@/components/ui/Button";
import { ProductRowActions } from "./ProductRowActions";

export const metadata = { title: "Produits" };

type Props = { searchParams: Promise<{ q?: string; statut?: string; categorie?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q = "", statut = "", categorie = "" } = await searchParams;
  const [products, { categories }] = await Promise.all([adminProducts(), adminCategories()]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  const nq = normalize(q);
  const list = products.filter(
    (p) =>
      (!statut ? p.status !== "archived" : p.status === statut) &&
      (!categorie || p.category === categorie) &&
      (!nq || normalize(`${p.name} ${p.brand ?? ""} ${p.slug}`).includes(nq)),
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase">Produits</h1>
          <p className="mt-1 text-sm text-steel">{list.length} produit(s) affiché(s) sur {products.length}</p>
        </div>
        <Link href="/admin/produits/nouveau" className={buttonClass("primary", "md")}><Plus size={16} /> Nouveau produit</Link>
      </div>

      {/* Filtres en GET : partageables, sans JS */}
      <form className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <input name="q" defaultValue={q} placeholder="Rechercher par nom, marque, slug…" className="h-11 border border-line bg-white px-3 text-sm outline-none focus:border-ink" />
        <select name="statut" defaultValue={statut} className="h-11 border border-line bg-white px-3 text-sm">
          <option value="">Actifs (publiés + brouillons)</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="archived">Archivés</option>
        </select>
        <select name="categorie" defaultValue={categorie} className="h-11 border border-line bg-white px-3 text-sm">
          <option value="">Toutes catégories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="h-11 bg-ink px-5 text-sm font-semibold text-paper">Filtrer</button>
      </form>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-steel">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Mise en avant</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${p.slug}`} className="flex items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden bg-paper-2">
                      {p.gallery[0] && <Image src={p.gallery[0].src} alt="" fill sizes="44px" className="object-cover" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold hover:underline">{p.name}</span>
                      <span className="block truncate text-xs text-steel">{p.brand ? `${p.brand} · ` : ""}{p.variants.map((v) => `${v.options.length} ${v.label.toLowerCase()}`).join(" · ") || "sans variante"}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel">{catName.get(p.category) ?? p.category}</td>
                <td className={`tabular px-4 py-3 ${p.gallery.length < 2 ? "text-accent-2" : ""}`}>{p.gallery.length}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3"><ProductRowActions slug={p.slug} status={p.status} featured={!!p.featured} popular={!!p.popular} part="flags" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {p.status === "published" && <a href={productUrl(p)} target="_blank" className="px-2 py-1 text-xs underline underline-offset-4">Voir</a>}
                    <ProductRowActions slug={p.slug} status={p.status} featured={!!p.featured} popular={!!p.popular} part="status" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-10 text-center text-steel">Aucun produit ne correspond.</p>}
      </div>
    </div>
  );
}
