/** Mentions légales. @hopsyder */
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function LegalPage() {
  const rows = [
    ["Raison sociale", `${SITE.name} — ${SITE.legalName}`],
    ["Forme", "Société à responsabilité limitée (SARL)"],
    ["Capital social", SITE.legal.capital],
    ["RCCM", SITE.legal.rccm],
    ["IFU", SITE.legal.ifu],
    ["Siège", `${SITE.address.plot}, ${SITE.address.district} — ${SITE.address.quarter}, ${SITE.address.city}, ${SITE.address.country}`],
    ["Téléphone", SITE.phone],
    ["Email", SITE.email],
  ];
  return (
    <>
      <PageHero title="Mentions légales" crumbs={[{ name: "Mentions légales", href: "/mentions-legales" }]} />
      <section className="shell section">
        <dl className="max-w-3xl divide-y divide-line rounded-[20px] border border-line bg-white px-6">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr]"><dt className="text-steel">{k}</dt><dd className="tabular font-medium">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-10 max-w-3xl text-sm text-steel">Les visuels présentés sont non contractuels. Les prix, caractéristiques et disponibilités sont confirmés par SOREMAC lors de l'établissement du devis.</p>
      </section>
    </>
  );
}
