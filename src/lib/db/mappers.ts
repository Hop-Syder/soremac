/**
 * Conversion lignes SQL (snake_case) ⇄ modèle applicatif (camelCase).
 * @hopsyder
 */
import type { Category, Product } from "@/lib/catalog/types";

export interface CategoryRow {
  slug: string; name: string; short_name: string | null; description: string | null; image: string | null;
  size: Category["size"] | null; related: string[] | null; position: number | null;
  seo_title: string | null; seo_description: string | null;
}

export interface ProductRow {
  slug: string; name: string; category: string; subcategory: string | null; brand: string | null;
  summary: string | null; presentation: string | null; usage: string | null; advice: string | null;
  gallery: Product["gallery"] | null; specs: Record<string, string> | null; variants: Product["variants"] | null;
  unit: string | null; packaging: string | null; badge: string | null; authenticity: string | null;
  documents: Product["documents"] | null; featured: boolean | null; popular: boolean | null;
  related: string[] | null; keywords: string[] | null; seo_title: string | null; seo_description: string | null;
  status: Product["status"]; updated_at?: string;
}

const u = <T,>(v: T | null | undefined) => (v === null ? undefined : v);
const n = <T,>(v: T | undefined) => (v === undefined || v === "" ? null : v);

export const rowToCategory = (r: CategoryRow): Category => ({
  slug: r.slug,
  name: r.name,
  shortName: r.short_name ?? r.name,
  description: r.description ?? "",
  image: r.image ?? "",
  size: r.size ?? "md",
  related: r.related ?? [],
  position: u(r.position),
  seoTitle: u(r.seo_title),
  seoDescription: u(r.seo_description),
});

export const categoryToRow = (c: Category): CategoryRow => ({
  slug: c.slug,
  name: c.name,
  short_name: n(c.shortName),
  description: n(c.description),
  image: n(c.image),
  size: c.size,
  related: c.related,
  position: c.position ?? 0,
  seo_title: n(c.seoTitle),
  seo_description: n(c.seoDescription),
});

export const rowToProduct = (r: ProductRow): Product => ({
  slug: r.slug,
  name: r.name,
  category: r.category,
  subcategory: u(r.subcategory),
  brand: u(r.brand),
  summary: r.summary ?? "",
  presentation: r.presentation ?? "",
  usage: u(r.usage),
  advice: u(r.advice),
  gallery: r.gallery ?? [],
  specs: r.specs ?? {},
  variants: r.variants ?? [],
  unit: r.unit ?? "unité(s)",
  packaging: u(r.packaging),
  badge: u(r.badge),
  authenticity: u(r.authenticity),
  documents: r.documents ?? [],
  featured: !!r.featured,
  popular: !!r.popular,
  related: r.related ?? [],
  keywords: r.keywords ?? [],
  seoTitle: u(r.seo_title),
  seoDescription: u(r.seo_description),
  status: r.status,
});

export const productToRow = (p: Product): ProductRow => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  subcategory: n(p.subcategory),
  brand: n(p.brand),
  summary: n(p.summary),
  presentation: n(p.presentation),
  usage: n(p.usage),
  advice: n(p.advice),
  gallery: p.gallery,
  specs: p.specs,
  variants: p.variants,
  unit: p.unit || "unité(s)",
  packaging: n(p.packaging),
  badge: n(p.badge),
  authenticity: n(p.authenticity),
  documents: p.documents ?? [],
  featured: !!p.featured,
  popular: !!p.popular,
  related: p.related ?? [],
  keywords: p.keywords ?? [],
  seo_title: n(p.seoTitle),
  seo_description: n(p.seoDescription),
  status: p.status,
});
