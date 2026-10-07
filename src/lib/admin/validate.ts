/**
 * Validation des saisies du back-office — côté serveur, jamais confiée au seul navigateur.
 * @hopsyder
 */
import type { Category, Product, ProductImage, VariantAxis } from "@/lib/catalog/types";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** « Fer à béton Fe500 » → « fer-a-beton-fe500 » */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opt = (v: unknown, max = 500) => str(v, max) || undefined;
const list = (v: unknown, max = 50) => (Array.isArray(v) ? v.map((x) => str(x, 120)).filter(Boolean).slice(0, max) : []);
const isUrl = (s: string) => /^https:\/\/[^\s]+$/.test(s) || s.startsWith("/");

export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const IMAGE_ROLES = new Set(["main", "side", "detail", "packaging", "texture", "dimensions", "usage", "site"]);
const SIZES = new Set(["xl", "lg", "md", "sm"]);
const STATUSES = new Set(["published", "draft", "archived"]);

export function validateProduct(raw: Record<string, unknown>, categorySlugs: string[]): Result<Product> {
  const errors: string[] = [];
  const name = str(raw.name, 120);
  const slug = str(raw.slug, 80) || slugify(name);
  const category = str(raw.category, 80);
  const status = STATUSES.has(raw.status as string) ? (raw.status as Product["status"]) : "draft";

  if (!name) errors.push("Le nom est obligatoire.");
  if (!SLUG_RE.test(slug)) errors.push("Le slug ne doit contenir que des minuscules, chiffres et tirets.");
  if (!categorySlugs.includes(category)) errors.push("Choisissez une catégorie existante.");

  const gallery: ProductImage[] = (Array.isArray(raw.gallery) ? raw.gallery : [])
    .slice(0, 12)
    .map((g: Record<string, unknown>) => ({
      src: str(g?.src, 600),
      alt: str(g?.alt, 200),
      ...(IMAGE_ROLES.has(g?.role as string) ? { role: g.role as ProductImage["role"] } : {}),
    }))
    .filter((g) => g.src);
  gallery.forEach((g, i) => {
    if (!isUrl(g.src)) errors.push(`Image ${i + 1} : URL invalide (https requis).`);
    if (!g.alt) errors.push(`Image ${i + 1} : le texte alternatif est obligatoire (accessibilité & SEO).`);
  });
  if (status === "published" && !gallery.length) errors.push("Un produit publié doit avoir au moins une image.");
  if (status === "published" && !str(raw.summary)) errors.push("Un produit publié doit avoir un résumé.");

  const specs: Record<string, string> = {};
  (Array.isArray(raw.specs) ? raw.specs : []).slice(0, 30).forEach((r: Record<string, unknown>) => {
    const k = str(r?.key, 60);
    const v = str(r?.value, 200);
    if (k && v) specs[k] = v;
  });

  const variants: VariantAxis[] = (Array.isArray(raw.variants) ? raw.variants : [])
    .slice(0, 6)
    .map((a: Record<string, unknown>) => ({
      key: slugify(str(a?.label, 60)) || str(a?.key, 60),
      label: str(a?.label, 60),
      ...(opt(a?.unit, 20) ? { unit: opt(a?.unit, 20) } : {}),
      options: list(a?.options, 60),
    }))
    .filter((a) => a.label && a.options.length);
  if (new Set(variants.map((v) => v.key)).size !== variants.length) errors.push("Deux axes de variantes portent le même nom.");

  const documents = (Array.isArray(raw.documents) ? raw.documents : [])
    .slice(0, 10)
    .map((d: Record<string, unknown>) => ({ label: str(d?.label, 120), href: str(d?.href, 600) }))
    .filter((d) => d.label && d.href);
  documents.forEach((d) => !isUrl(d.href) && errors.push(`Document « ${d.label} » : URL invalide.`));

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      slug,
      name,
      category,
      subcategory: opt(raw.subcategory, 80),
      brand: opt(raw.brand, 80),
      summary: str(raw.summary, 300),
      presentation: str(raw.presentation, 4000),
      usage: opt(raw.usage, 2000),
      advice: opt(raw.advice, 2000),
      gallery,
      specs,
      variants,
      unit: str(raw.unit, 30) || "unité(s)",
      packaging: opt(raw.packaging, 120),
      badge: opt(raw.badge, 40),
      authenticity: opt(raw.authenticity, 300),
      documents,
      featured: raw.featured === true,
      popular: raw.popular === true,
      related: list(raw.related, 12).filter((s) => s !== slug),
      keywords: list(raw.keywords, 30).map((k) => k.toLowerCase()),
      seoTitle: opt(raw.seoTitle, 70),
      seoDescription: opt(raw.seoDescription, 170),
      status,
    },
  };
}

export function validateCategory(raw: Record<string, unknown>, otherSlugs: string[]): Result<Category> {
  const errors: string[] = [];
  const name = str(raw.name, 80);
  const slug = str(raw.slug, 80) || slugify(name);
  const image = str(raw.image, 600);
  if (!name) errors.push("Le nom est obligatoire.");
  if (!SLUG_RE.test(slug)) errors.push("Slug invalide.");
  if (image && !isUrl(image)) errors.push("URL d'image invalide.");
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      slug,
      name,
      shortName: str(raw.shortName, 40) || name,
      description: str(raw.description, 400),
      image,
      size: SIZES.has(raw.size as string) ? (raw.size as Category["size"]) : "md",
      related: list(raw.related, 10).filter((s) => s !== slug && otherSlugs.includes(s)),
      position: Number.isFinite(Number(raw.position)) ? Number(raw.position) : 0,
      seoTitle: opt(raw.seoTitle, 70),
      seoDescription: opt(raw.seoDescription, 170),
    },
  };
}
