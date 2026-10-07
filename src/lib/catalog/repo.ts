/**
 * Dépôt catalogue — lecture publique.
 * Supabase configuré → données du back-office (cache taggé « catalog », invalidé à chaque modification).
 * Sinon → catalogue initial embarqué (seed), pour que le site fonctionne toujours.
 * @hopsyder
 */
import { cache } from "react";
import type { Category, Product } from "./types";
import { seedCategories } from "./categories";
import { seedProducts } from "./products";
import { db, isDbConfigured } from "@/lib/db/supabase";
import { rowToCategory, rowToProduct, type CategoryRow, type ProductRow } from "@/lib/db/mappers";

export const CATALOG_TAG = "catalog";

export interface Catalog {
  categories: Category[];
  /** Produits publiés uniquement */
  products: Product[];
}

const withNames = (categories: Category[], products: Product[]) => {
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  return products.map((p) => ({ ...p, categoryName: names.get(p.category) }));
};

/** Mémoïsé par requête (React cache) + cache de données Next (fetch taggé). */
export const getCatalog = cache(async (): Promise<Catalog> => {
  if (isDbConfigured()) {
    try {
      const [cats, prods] = await Promise.all([
        db<CategoryRow[]>("categories?select=*&order=position.asc,name.asc", { tags: [CATALOG_TAG] }),
        db<ProductRow[]>("products?select=*&status=eq.published&order=name.asc", { tags: [CATALOG_TAG] }),
      ]);
      // Base vide (avant import initial) : on garde le seed plutôt qu'un site vide
      if (cats.length) {
        const categories = cats.map(rowToCategory);
        return { categories, products: withNames(categories, prods.map(rowToProduct)) };
      }
    } catch (e) {
      console.error("[catalog] lecture Supabase impossible, repli sur le seed :", e);
    }
  }
  const categories = seedCategories.map((c, i) => ({ ...c, position: i }));
  return { categories, products: withNames(categories, seedProducts.filter((p) => p.status === "published")) };
});

/* Helpers purs sur un catalogue déjà chargé */

export const findCategory = (c: Catalog, slug: string) => c.categories.find((x) => x.slug === slug);
export const findProduct = (c: Catalog, slug: string) => c.products.find((p) => p.slug === slug);
export const productsIn = (c: Catalog, cat: string) => c.products.filter((p) => p.category === cat);
export const featured = (c: Catalog) => c.products.filter((p) => p.featured);

/** Produits associés : liste éditoriale d'abord, complétée par la catégorie. */
export function relatedTo(c: Catalog, product: Product, limit = 4): Product[] {
  const explicit = (product.related ?? []).map((s) => findProduct(c, s)).filter((p): p is Product => !!p);
  const fill = c.products.filter((p) => p.slug !== product.slug && p.category === product.category && !explicit.includes(p));
  return [...explicit, ...fill].slice(0, limit);
}
