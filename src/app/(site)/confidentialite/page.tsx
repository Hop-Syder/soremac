/** Politique de confidentialité (base à faire valider juridiquement). @hopsyder */
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default function PrivacyPage() {
  const blocks = [
    { h: "Données collectées", t: "Lors d'une demande de devis ou de contact : nom, téléphone, email, entreprise et contenu de votre demande." },
    { h: "Finalité", t: "Ces données servent uniquement à traiter votre demande et à vous recontacter. Elles ne sont ni vendues ni cédées." },
    { h: "Sélection de devis", t: "Votre sélection de produits est conservée dans votre navigateur (stockage local) jusqu'à son envoi ou sa suppression." },
    { h: "Vos droits", t: `Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à ${SITE.email}.` },
  ];
  return (
    <>
      <PageHero title="Politique de confidentialité" crumbs={[{ name: "Confidentialité", href: "/confidentialite" }]} />
      <section className="container-x max-w-3xl py-16">
        {blocks.map((b) => (
          <div key={b.h} className="mb-8"><h2 className="font-display text-2xl font-bold uppercase">{b.h}</h2><p className="mt-2 text-ink/80">{b.t}</p></div>
        ))}
      </section>
    </>
  );
}
