/**
 * Tableau de bord : état du catalogue, demandes à traiter, import initial.
 * @hopsyder
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { adminCategories, adminProducts, adminQuotes, quoteCounts } from "@/lib/admin/data";
import { isDbConfigured } from "@/lib/db/supabase";
import { Card, Notice, StatusBadge } from "@/components/admin/ui";
import { ImportSeedButton } from "./ImportSeedButton";

export const metadata = { title: "Tableau de bord" };

type Props = { searchParams: Promise<{ importe?: string }> };

export default async function Dashboard({ searchParams }: Props) {
  const { importe } = await searchParams;
  const [{ categories, seeded }, products, counts, latest] = await Promise.all([adminCategories(), adminProducts(), quoteCounts(), adminQuotes("nouveau")]);
  const by = (s: string) => products.filter((p) => p.status === s).length;
  const noImage = products.filter((p) => p.status === "published" && p.gallery.length < 2);

  const stats = [
    { label: "Demandes nouvelles", value: counts.nouveau, href: "/admin/devis?statut=nouveau", accent: counts.nouveau > 0 },
    { label: "En traitement", value: counts.en_traitement, href: "/admin/devis?statut=en_traitement" },
    { label: "Produits publiés", value: by("published"), href: "/admin/produits?statut=published" },
    { label: "Brouillons", value: by("draft"), href: "/admin/produits?statut=draft" },
  ];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <header>
        <p className="eyebrow">Back-office SOREMAC</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase md:text-5xl">Tableau de bord</h1>
      </header>

      {importe && <Notice tone="success">Catalogue initial importé ({importe} produits). Vous pouvez maintenant l'éditer.</Notice>}

      {isDbConfigured() && !seeded && categories.length === 0 && (
        <Card title="Démarrage">
          <p className="mb-4 text-sm text-steel">La base est vide. Importez le catalogue initial (11 catégories, produits prioritaires) pour commencer à l'éditer.</p>
          <ImportSeedButton />
        </Card>
      )}

      <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="group block bg-white p-5 transition-colors hover:bg-paper">
              <p className={`tabular font-display text-5xl font-black ${s.accent ? "text-accent-2" : ""}`}>{s.value}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-steel">
                {s.label} <ArrowRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Dernières demandes" action={<Link href="/admin/devis" className="text-sm font-medium underline underline-offset-4">Tout voir</Link>}>
          {latest.length ? (
            <ul className="-my-3 divide-y divide-line">
              {latest.slice(0, 6).map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{q.name} <span className="font-normal text-steel">· {q.phone}</span></p>
                    <p className="truncate text-sm text-steel">
                      {q.type === "devis" ? `${q.items.length} produit(s) : ${q.items.map((i) => i.name).join(", ")}` : q.subject ?? "Message"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-steel">{new Date(q.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-steel">{isDbConfigured() ? "Aucune nouvelle demande." : "Les demandes apparaîtront ici une fois Supabase configuré."}</p>
          )}
        </Card>

        <Card title="Qualité du catalogue">
          <p className="text-sm text-steel">Le TDR recommande 5 à 8 photos par fiche. Fiches publiées avec moins de 2 images :</p>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {noImage.slice(0, 8).map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-2">
                <Link href={`/admin/produits/${p.slug}`} className="truncate underline-offset-4 hover:underline">{p.name}</Link>
                <StatusBadge status={p.status} />
              </li>
            ))}
            {!noImage.length && <li className="text-steel">Toutes les fiches ont au moins 2 images. 👍</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
