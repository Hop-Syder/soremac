/**
 * Lecture des données du back-office (tous statuts, sans cache).
 * Sans Supabase : lecture seule du catalogue initial, pour prévisualiser l'admin.
 * @hopsyder
 */
import "server-only";
import type { Category, Product } from "@/lib/catalog/types";
import { seedCategories } from "@/lib/catalog/categories";
import { seedProducts } from "@/lib/catalog/products";
import { db, isDbConfigured } from "@/lib/db/supabase";
import { rowToCategory, rowToProduct, type CategoryRow, type ProductRow } from "@/lib/db/mappers";

export type QuoteStatus = "nouveau" | "en_traitement" | "traite" | "archive";

export interface QuoteRequest {
  id: string;
  created_at: string;
  type: "devis" | "contact";
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  subject: string | null;
  note: string | null;
  items: { name: string; variant?: string; quantity: number; unit?: string }[];
  status: QuoteStatus;
}

export const QUOTE_STATUSES: { value: QuoteStatus; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_traitement", label: "En traitement" },
  { value: "traite", label: "Traité" },
  { value: "archive", label: "Archivé" },
];

export async function adminCategories(): Promise<{ categories: Category[]; seeded: boolean }> {
  if (!isDbConfigured()) return { categories: seedCategories.map((c, i) => ({ ...c, position: i })), seeded: true };
  const rows = await db<CategoryRow[]>("categories?select=*&order=position.asc,name.asc");
  return { categories: rows.map(rowToCategory), seeded: false };
}

export async function adminProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return seedProducts;
  const rows = await db<ProductRow[]>("products?select=*&order=updated_at.desc");
  return rows.map(rowToProduct);
}

export async function adminProduct(slug: string): Promise<Product | null> {
  if (!isDbConfigured()) return seedProducts.find((p) => p.slug === slug) ?? null;
  const rows = await db<ProductRow[]>(`products?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function adminQuotes(status?: QuoteStatus): Promise<QuoteRequest[]> {
  if (!isDbConfigured()) return [];
  const filter = status ? `&status=eq.${status}` : "&status=neq.archive";
  return db<QuoteRequest[]>(`quote_requests?select=*&order=created_at.desc&limit=200${filter}`);
}

export async function quoteCounts(): Promise<Record<QuoteStatus, number>> {
  const counts: Record<QuoteStatus, number> = { nouveau: 0, en_traitement: 0, traite: 0, archive: 0 };
  if (!isDbConfigured()) return counts;
  const rows = await db<{ status: QuoteStatus }[]>("quote_requests?select=status&limit=5000");
  rows.forEach((r) => counts[r.status]++);
  return counts;
}
