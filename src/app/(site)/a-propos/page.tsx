/**
 * /a-propos — une narration (TDR §36) : héros, timeline, mission, valeurs, expertise,
 * localisation, engagement qualité, identité légale.
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import { HandshakeIcon, MapPinIcon, MedalIcon, SealCheckIcon } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { Timeline } from "@/components/about/Timeline";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SITE, yearsOfExperience } from "@/lib/site";
import { unsplash } from "@/lib/services";

export const metadata: Metadata = {
  title: "À propos — plus de 30 ans de confiance",
  description: `SOREMAC SARL, distributeur de matériaux de construction à Cotonou depuis ${SITE.foundedYear}. Histoire, mission, valeurs et engagement qualité.`,
  alternates: { canonical: "/a-propos" },
};

const values = [
  { icon: MedalIcon, t: "Expertise", d: "Une connaissance fine des matériaux et des besoins des chantiers locaux." },
  { icon: SealCheckIcon, t: "Qualité", d: "Des produits sélectionnés et l'authenticité des références distribuées." },
  { icon: MapPinIcon, t: "Proximité", d: `Un point de vente à ${SITE.address.district}, ${SITE.address.quarter}, au cœur de Cotonou.` },
  { icon: HandshakeIcon, t: "Engagement", d: "Des réponses rapides par téléphone, WhatsApp et email." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={SITE.legalName}
        title="Plus de 30 ans à construire la confiance."
        intro={`Depuis ${SITE.foundedYear}, SOREMAC approvisionne les chantiers du Bénin : particuliers, artisans, entreprises de BTP, promoteurs et institutions.`}
        crumbs={[{ name: "À propos", href: "/a-propos" }]}
        aside={
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: `${yearsOfExperience()}+`, v: "ans d'activité" },
              { k: "11", v: "familles de produits" },
              { k: "Détail", v: "& vente en gros" },
              { k: "Cotonou", v: `${SITE.address.district}` },
            ].map((s) => (
              <div key={s.v} className="rounded-[18px] border border-line bg-white p-5">
                <p className="tabular font-display text-3xl font-bold tracking-tight">{s.k}</p>
                <p className="mt-1 text-sm text-steel">{s.v}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="pt-10">
        <Reveal className="shell">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-paper-2 md:aspect-[21/8]">
            <Image src={unsplash("photo-1503387762-592deb58ef4e", 2000)} alt="Chantier de construction approvisionné par SOREMAC" fill sizes="100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeader eyebrow="Notre histoire" title="D'un comptoir de matériaux à un partenaire de chantier." className="lg:sticky lg:top-28 lg:self-start" />
          <Timeline />
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Mission</p>
            <h2 className="t-h2 mt-4">Fournir le bon matériau, au bon moment.</h2>
          </Reveal>
          <Reveal delay={0.1} className="grid gap-5 text-lg leading-relaxed text-ink/80">
            <p>Fourniture de matériel et d'équipements, importation de matériaux de construction et de diverses marchandises : notre métier est de réunir en un seul lieu ce dont un chantier a besoin.</p>
            <p>Nous accompagnons chaque client dans le choix des références, de la première fondation aux finitions, en détail comme en gros.</p>
            <ButtonLink href="/produits" variant="dark" className="mt-2 self-start">Découvrir le catalogue</ButtonLink>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeader eyebrow="Ce qui nous guide" title="Nos valeurs." />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.t} className="rounded-[20px] border border-line bg-white p-7 shadow-[var(--shadow-card)]">
                <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent-2"><v.icon size={24} weight="duotone" /></span>
                <h3 className="t-h3 mt-5">{v.t}</h3>
                <p className="mt-2 text-steel">{v.d}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-10 grid gap-3 rounded-[20px] border border-line bg-white p-6 sm:grid-cols-3 md:p-8">
            {[["RCCM", SITE.legal.rccm], ["IFU", SITE.legal.ifu], ["Capital social", SITE.legal.capital]].map(([k, v]) => (
              <div key={k}>
                <p className="text-sm text-steel">{k}</p>
                <p className="tabular mt-1 font-semibold">{v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
