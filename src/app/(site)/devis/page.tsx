/**
 * /devis — page dédiée du Devis Builder (TDR §32, §63).
 * @hopsyder
 */
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { QuotePageClient } from "./QuotePageClient";

export const metadata: Metadata = {
  title: "Demander un devis",
  description: "Composez votre liste de matériaux et recevez un devis SOREMAC. Envoi par formulaire ou WhatsApp.",
  alternates: { canonical: "/devis" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero eyebrow="Devis" title="Besoin d'un devis ? Parlons-en." intro="Choisissez vos produits. Nous vous accompagnons pour la suite." crumbs={[{ name: "Devis", href: "/devis" }]} />
      <section className="container-x py-12 md:py-20"><QuotePageClient /></section>
    </>
  );
}
