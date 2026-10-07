/**
 * /a-propos — une narration, pas trois paragraphes centrés (TDR §36).
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Timeline } from "@/components/about/Timeline";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SITE, yearsOfExperience } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos — plus de 30 ans de confiance",
  description: `SOREMAC SARL, distributeur de matériaux de construction à Cotonou depuis ${SITE.foundedYear}. Histoire, mission, valeurs et engagement qualité.`,
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={`${SITE.legalName}`} title="Plus de 30 ans à construire la confiance." crumbs={[{ name: "À propos", href: "/a-propos" }]} />

      <section className="relative h-[46vh] min-h-[320px] overflow-hidden bg-ink md:h-[64vh]">
        <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2400&q=80&auto=format&fit=crop" alt="Chantier de construction" fill sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-x-0 bottom-0 container-x pb-8">
          <p className="tabular font-display text-[clamp(5rem,18vw,16rem)] font-black uppercase leading-[0.8] text-paper/90">{SITE.foundedYear}</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x"><Timeline /></div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="eyebrow">Mission</p>
            <h2 className="h-section mt-4">Fournir le bon matériau, au bon moment.</h2>
          </Reveal>
          <Reveal delay={0.1} className="text-lg leading-relaxed text-ink/80">
            <p>Depuis {yearsOfExperience()} ans, SOREMAC accompagne particuliers, artisans, entreprises de BTP, promoteurs et institutions dans l'approvisionnement de leurs chantiers au Bénin.</p>
            <p className="mt-5">Fourniture de matériel et d'équipements, importation de matériaux de construction et de diverses marchandises : notre métier est de réunir en un seul lieu ce dont un chantier a besoin.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-2 py-20 md:py-28">
        <div className="container-x">
          <Reveal><p className="eyebrow">Ce qui nous guide</p></Reveal>
          <Stagger className="mt-8 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Expertise", d: "Une connaissance fine des matériaux et des besoins des chantiers locaux." },
              { t: "Qualité", d: "Des produits sélectionnés et l'authenticité des références distribuées." },
              { t: "Proximité", d: `Un point de vente à ${SITE.address.district}, ${SITE.address.quarter}, au cœur de Cotonou.` },
              { t: "Engagement", d: "Des réponses rapides par téléphone, WhatsApp et email." },
            ].map((v) => (
              <StaggerItem key={v.t} className="bg-paper-2 p-8">
                <h3 className="font-display text-3xl font-bold uppercase">{v.t}</h3>
                <p className="mt-3 text-steel">{v.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 grid gap-6 text-sm text-steel sm:grid-cols-3">
            <p><span className="block text-[11px] uppercase tracking-[0.18em]">RCCM</span><span className="tabular text-base text-ink">{SITE.legal.rccm}</span></p>
            <p><span className="block text-[11px] uppercase tracking-[0.18em]">IFU</span><span className="tabular text-base text-ink">{SITE.legal.ifu}</span></p>
            <p><span className="block text-[11px] uppercase tracking-[0.18em]">Capital social</span><span className="tabular text-base text-ink">{SITE.legal.capital}</span></p>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
