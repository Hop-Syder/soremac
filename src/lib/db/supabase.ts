/**
 * Client REST Supabase minimal, exclusivement côté serveur (clé service_role).
 * Pas de SDK : fetch natif, typé, sans cache par défaut.
 * @hopsyder
 */

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isDbConfigured = () => Boolean(URL_ && KEY);

export const STORAGE_BUCKET = "catalogue";

export class DbError extends Error {}

function headers(extra?: HeadersInit): HeadersInit {
  return { apikey: KEY!, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...extra };
}

/** Appel PostgREST : `path` = "products?select=*&status=eq.published" */
export async function db<T = unknown>(
  path: string,
  init: RequestInit & { prefer?: string; tags?: string[] } = {},
): Promise<T> {
  if (!isDbConfigured()) throw new DbError("Supabase n'est pas configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  const { prefer, tags, ...rest } = init;
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...rest,
    headers: headers(prefer ? { Prefer: prefer } : undefined),
    // Lecture publique : cache taggé, invalidé par le back-office. Écritures : jamais en cache.
    ...(tags ? { next: { tags, revalidate: 3600 } } : { cache: "no-store" }),
  });
  if (!res.ok) throw new DbError(`Supabase ${res.status} : ${await res.text()}`);
  if (res.status === 204 || res.headers.get("content-length") === "0") return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Upload d'un fichier dans Supabase Storage ; renvoie son URL publique. */
export async function uploadFile(file: File, folder: string): Promise<string> {
  if (!isDbConfigured()) throw new DbError("Supabase n'est pas configuré.");
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const res = await fetch(`${URL_}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!res.ok) throw new DbError(`Upload ${res.status} : ${await res.text()}`);
  return `${URL_}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}
