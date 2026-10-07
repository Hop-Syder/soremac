/** Sitemap XML : pages, catégories, produits, articles. @hopsyder */
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { productUrl } from "@/lib/catalog/products";
import { getCatalog } from "@/lib/catalog/repo";
import { articles } from "@/lib/catalog/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products: published } = await getCatalog();
  const now = new Date();
  const page = (path: string, priority: number) => ({ url: `${SITE.url}${path}`, lastModified: now, priority });
  return [
    page("/", 1),
    page("/produits", 0.9),
    ...categories.map((c) => page(`/produits/${c.slug}`, 0.8)),
    ...published.map((p) => page(productUrl(p), 0.8)),
    page("/services", 0.6),
    page("/a-propos", 0.5),
    page("/contact", 0.7),
    page("/devis", 0.6),
    page("/conseils", 0.6),
    ...articles.map((a) => page(`/conseils/${a.slug}`, 0.5)),
  ];
}
