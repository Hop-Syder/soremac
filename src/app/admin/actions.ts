/**
 * Actions serveur du back-office.
 * Chaque action vérifie la session (requireAdmin) avant toute lecture ou écriture,
 * valide les données côté serveur, puis invalide le cache du site public.
 * @hopsyder
 */
"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { checkPassword, createSession, destroySession, isAuthConfigured, requireAdmin } from "@/lib/admin/auth";
import { validateCategory, validateProduct } from "@/lib/admin/validate";
import { adminCategories, QUOTE_STATUSES, type QuoteStatus } from "@/lib/admin/data";
import { db, DbError, isDbConfigured, uploadFile } from "@/lib/db/supabase";
import { categoryToRow, productToRow } from "@/lib/db/mappers";
import { seedCategories } from "@/lib/catalog/categories";
import { seedProducts } from "@/lib/catalog/products";
import { CATALOG_TAG } from "@/lib/catalog/repo";

export type ActionState = { ok?: boolean; message?: string; errors?: string[] } | null;

const NO_DB: ActionState = { errors: ["Supabase n'est pas configuré : le back-office est en lecture seule (voir README)."] };

/** Le site public relit le catalogue immédiatement après une modification. */
function refreshSite() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

const fail = (e: unknown): ActionState => ({ errors: [e instanceof DbError ? e.message : "Erreur inattendue. Réessayez."] });

/* ─────────────── Session ─────────────── */

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  if (!isAuthConfigured()) return { errors: ["ADMIN_PASSWORD et ADMIN_SECRET (≥ 32 caractères) doivent être définis."] };
  if (!checkPassword(String(form.get("password") ?? ""))) {
    // Ralentit les tentatives par force brute
    await new Promise((r) => setTimeout(r, 800));
    return { errors: ["Mot de passe incorrect."] };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ─────────────── Produits ─────────────── */

export async function saveProduct(originalSlug: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  if (!isDbConfigured()) return NO_DB;

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(String(form.get("payload")));
  } catch {
    return { errors: ["Données du formulaire illisibles."] };
  }

  const { categories } = await adminCategories();
  const res = validateProduct(raw, categories.map((c) => c.slug));
  if (!res.ok) return { errors: res.errors };
  const row = { ...productToRow(res.value), updated_at: new Date().toISOString() };

  try {
    if (!originalSlug || originalSlug !== row.slug) {
      const clash = await db<unknown[]>(`products?select=slug&slug=eq.${row.slug}`);
      if (clash.length) return { errors: [`Le slug « ${row.slug} » est déjà utilisé par un autre produit.`] };
    }
    if (originalSlug) await db(`products?slug=eq.${encodeURIComponent(originalSlug)}`, { method: "PATCH", body: JSON.stringify(row) });
    else await db("products", { method: "POST", body: JSON.stringify(row) });
  } catch (e) {
    return fail(e);
  }
  refreshSite();
  redirect(`/admin/produits/${row.slug}?enregistre=1`);
}

export async function setProductStatus(slug: string, status: "published" | "draft" | "archived") {
  await requireAdmin();
  if (!isDbConfigured()) return;
  await db(`products?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify({ status, updated_at: new Date().toISOString() }) });
  refreshSite();
  revalidatePath("/admin/produits");
}

export async function toggleProductFlag(slug: string, flag: "featured" | "popular", value: boolean) {
  await requireAdmin();
  if (!isDbConfigured()) return;
  await db(`products?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify({ [flag]: value }) });
  refreshSite();
  revalidatePath("/admin/produits");
}

/* ─────────────── Catégories ─────────────── */

export async function saveCategory(originalSlug: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  if (!isDbConfigured()) return NO_DB;
  const { categories } = await adminCategories();
  const raw = Object.fromEntries(form);
  const res = validateCategory(
    { ...raw, related: form.getAll("related"), position: originalSlug ? raw.position : categories.length },
    categories.map((c) => c.slug),
  );
  if (!res.ok) return { errors: res.errors };
  const row = categoryToRow(res.value);
  try {
    if (originalSlug !== row.slug && categories.some((c) => c.slug === row.slug))
      return { errors: [`Le slug « ${row.slug} » existe déjà.`] };
    if (originalSlug) {
      await db(`categories?slug=eq.${encodeURIComponent(originalSlug)}`, { method: "PATCH", body: JSON.stringify(row) });
      // Renommage du slug : on rattache les produits à la nouvelle catégorie
      if (originalSlug !== row.slug)
        await db(`products?category=eq.${encodeURIComponent(originalSlug)}`, { method: "PATCH", body: JSON.stringify({ category: row.slug }) });
    } else {
      await db("categories", { method: "POST", body: JSON.stringify(row) });
    }
  } catch (e) {
    return fail(e);
  }
  refreshSite();
  revalidatePath("/admin/categories");
  return { ok: true, message: "Catégorie enregistrée." };
}

/** Réorganisation : échange de position avec la voisine (haut/bas). */
export async function moveCategory(slug: string, dir: -1 | 1) {
  await requireAdmin();
  if (!isDbConfigured()) return;
  const { categories } = await adminCategories();
  const i = categories.findIndex((c) => c.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= categories.length) return;
  const order = [...categories];
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(
    order.map((c, pos) =>
      c.position === pos ? null : db(`categories?slug=eq.${encodeURIComponent(c.slug)}`, { method: "PATCH", body: JSON.stringify({ position: pos }) }),
    ),
  );
  refreshSite();
  revalidatePath("/admin/categories");
}

export async function deleteCategory(slug: string): Promise<ActionState> {
  await requireAdmin();
  if (!isDbConfigured()) return NO_DB;
  const used = await db<unknown[]>(`products?select=slug&category=eq.${encodeURIComponent(slug)}&limit=1`);
  if (used.length) return { errors: ["Cette catégorie contient des produits : déplacez-les ou archivez-les d'abord."] };
  await db(`categories?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE" });
  refreshSite();
  revalidatePath("/admin/categories");
  return { ok: true };
}

/* ─────────────── Demandes de devis ─────────────── */

export async function setQuoteStatus(id: string, status: QuoteStatus) {
  await requireAdmin();
  if (!isDbConfigured() || !QUOTE_STATUSES.some((s) => s.value === status)) return;
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  await db(`quote_requests?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  revalidatePath("/admin", "layout");
}

/* ─────────────── Médias ─────────────── */

const MAX_UPLOAD = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);

export async function uploadMedia(form: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  if (!isDbConfigured()) return { error: "Supabase n'est pas configuré." };
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return { error: "Aucun fichier reçu." };
  if (!ALLOWED.has(file.type)) return { error: "Formats acceptés : JPEG, PNG, WebP, AVIF, PDF." };
  if (file.size > MAX_UPLOAD) return { error: "Fichier trop lourd (8 Mo maximum)." };
  try {
    return { url: await uploadFile(file, file.type === "application/pdf" ? "documents" : "produits") };
  } catch (e) {
    return { error: e instanceof DbError ? e.message : "Upload impossible." };
  }
}

/* ─────────────── Import initial ─────────────── */

/** Copie le catalogue embarqué dans Supabase (sans écraser les fiches existantes). */
export async function importSeed(): Promise<ActionState> {
  await requireAdmin();
  if (!isDbConfigured()) return NO_DB;
  try {
    const ignore = "resolution=ignore-duplicates,return=minimal";
    await db("categories?on_conflict=slug", { method: "POST", prefer: ignore, body: JSON.stringify(seedCategories.map((c, i) => categoryToRow({ ...c, position: i }))) });
    await db("products?on_conflict=slug", { method: "POST", prefer: ignore, body: JSON.stringify(seedProducts.map(productToRow)) });
  } catch (e) {
    return fail(e);
  }
  refreshSite();
  // Le bloc d'import disparaît une fois la base remplie : la confirmation s'affiche sur le tableau de bord
  redirect(`/admin?importe=${seedProducts.length}`);
}
