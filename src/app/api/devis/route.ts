/**
 * POST /api/devis — réception des demandes de devis et de contact.
 * Persistance dans Supabase (table quote_requests, cf. docs/supabase-schema.sql)
 * si les variables d'environnement sont présentes ; sinon journalisation serveur.
 * Statuts back-office : nouveau → en_traitement → traite → archive (TDR §44).
 * @hopsyder
 */
import { NextResponse } from "next/server";

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const record = {
    type: body.type === "contact" ? "contact" : "devis",
    name: str(body.name, 120),
    phone: str(body.phone, 40),
    email: str(body.email, 160) || null,
    company: str(body.company, 160) || null,
    subject: str(body.subject, 200) || null,
    note: str(body.note, 3000) || null,
    items: Array.isArray(body.items)
      ? body.items.slice(0, 100).map((i: Record<string, unknown>) => ({
          name: str(i?.name, 200),
          variant: str(i?.variant, 200),
          quantity: Math.max(1, Math.min(1_000_000, Number(i?.quantity) || 1)),
          unit: str(i?.unit, 40),
        }))
      : [],
    status: "nouveau",
  };

  if (!record.name || !record.phone) return NextResponse.json({ error: "Nom et téléphone requis" }, { status: 422 });
  if (record.type === "devis" && !record.items.length) return NextResponse.json({ error: "Aucun produit" }, { status: 422 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const res = await fetch(`${url}/rest/v1/quote_requests`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      console.error("[devis] Supabase", res.status, await res.text());
      return NextResponse.json({ error: "Enregistrement impossible" }, { status: 502 });
    }
  } else {
    console.info("[devis] nouvelle demande (Supabase non configuré)", JSON.stringify(record));
  }
  return NextResponse.json({ ok: true });
}
