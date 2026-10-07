/**
 * Demandes de devis & contact (TDR §44) — statuts : Nouveau, En traitement, Traité, Archivé.
 * Réponse directe en un clic : WhatsApp pré-rempli, appel, email.
 * @hopsyder
 */
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { adminQuotes, QUOTE_STATUSES, quoteCounts, type QuoteStatus } from "@/lib/admin/data";
import { StatusBadge } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/ui/icons";
import { QuoteStatusSelect } from "./QuoteStatusSelect";
import { cn } from "@/lib/cn";

export const metadata = { title: "Demandes" };

type Props = { searchParams: Promise<{ statut?: string }> };

const waReply = (phone: string, name: string) => {
  const digits = phone.replace(/[^\d]/g, "");
  const intl = digits.length === 8 || digits.length === 10 ? `229${digits}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(`Bonjour ${name}, SOREMAC fait suite à votre demande de devis.`)}`;
};

export default async function QuotesPage({ searchParams }: Props) {
  const { statut } = await searchParams;
  const status = QUOTE_STATUSES.find((s) => s.value === statut)?.value as QuoteStatus | undefined;
  const [quotes, counts] = await Promise.all([adminQuotes(status), quoteCounts()]);

  const tabs = [{ value: undefined, label: "À traiter", n: counts.nouveau + counts.en_traitement + counts.traite }, ...QUOTE_STATUSES.map((s) => ({ ...s, n: counts[s.value] }))];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <h1 className="font-display text-4xl font-bold uppercase">Demandes</h1>

      <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.value ? `/admin/devis?statut=${t.value}` : "/admin/devis"}
            className={cn("-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium", status === t.value ? "border-accent text-ink" : "border-transparent text-steel hover:text-ink")}
          >
            {t.label} <span className="tabular text-xs text-steel">({t.n})</span>
          </Link>
        ))}
      </nav>

      {quotes.length === 0 && <p className="py-10 text-center text-steel">Aucune demande dans cette vue.</p>}

      <ul className="grid gap-3">
        {quotes.map((q) => (
          <li key={q.id} className="border border-line bg-white">
            <details className="group" open={q.status === "nouveau"}>
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <StatusBadge status={q.status} />
                <span className="font-semibold">{q.name}</span>
                {q.company && <span className="text-sm text-steel">{q.company}</span>}
                <span className="text-sm text-steel">{q.type === "devis" ? `Devis · ${q.items.length} ligne(s)` : `Contact · ${q.subject ?? ""}`}</span>
                <time className="ml-auto text-xs text-steel" dateTime={q.created_at}>
                  {new Date(q.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </summary>
              <div className="grid gap-6 border-t border-line px-5 py-5 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  {q.items.length > 0 && (
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-[11px] uppercase tracking-wider text-steel"><th className="pb-2">Produit</th><th className="pb-2">Variante</th><th className="pb-2 text-right">Qté</th></tr></thead>
                      <tbody>
                        {q.items.map((i, k) => (
                          <tr key={k} className="border-t border-line">
                            <td className="py-2 pr-3 font-medium">{i.name}</td>
                            <td className="py-2 pr-3 text-steel">{i.variant || "—"}</td>
                            <td className="tabular py-2 text-right">{i.quantity} {i.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {q.note && <p className="mt-4 whitespace-pre-line bg-paper p-3 text-sm">{q.note}</p>}
                </div>
                <div className="grid content-start gap-3">
                  <div className="flex flex-wrap gap-2">
                    <a href={waReply(q.phone, q.name)} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 bg-whatsapp px-3 text-sm font-semibold text-white"><WhatsAppIcon size={16} /> Répondre</a>
                    <a href={`tel:${q.phone}`} className="inline-flex h-10 items-center gap-2 border border-line px-3 text-sm font-medium"><Phone size={15} /> {q.phone}</a>
                    {q.email && <a href={`mailto:${q.email}`} className="inline-flex h-10 items-center gap-2 border border-line px-3 text-sm font-medium"><Mail size={15} /> Email</a>}
                  </div>
                  <QuoteStatusSelect id={q.id} status={q.status} />
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
