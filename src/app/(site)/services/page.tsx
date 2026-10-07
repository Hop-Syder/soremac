/**
 * /services — six services (TDR §37) : titre, description, photographie, CTA.
 * Mise en page éditoriale alternée image / texte.
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ACCOMPANIMENT, SERVICES, unsplash } from "@/lib/services";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Services — vente, livraison, conseil, devis",
  description: "Vente détail & gros, livraison à Cotonou et environs, conseil technique, devis par WhatsApp, paiement comptant, chèque ou Mobile Money.",
  alternates: { canonical: "/services" },
};

const CTA = [
  { label: "Explorer les produits", href: "/produits" },
  { label: "Nous contacter", href: "/contact" },
  { label: "Parler à un conseiller", href: "/contact" },
  { label: "Demander un devis", href: "/devis" },
  { label: "Demander un devis", href: "/devis" },
  { label: "Nous contacter", href: "/contact" },
];

export default function ServicesPage() {
  const all = [...SERVICES, ACCOMPANIMENT];
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Plus que des matériaux. Un accompagnement."
        intro="De la sélection des références à la livraison, SOREMAC vous accompagne à chaque étape de votre chantier."
        crumbs={[{ name: "Services", href: "/services" }]}
      >
        <nav aria-label="Services" className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {all.map((s) => (
            <a key={s.n} href={`#service-${s.n}`} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-ink/30">
              <s.icon size={16} weight="duotone" className="text-accent-2" /> {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section">
        <div className="shell grid gap-6 md:gap-8">
          {all.map((s, i) => (
            <Reveal key={s.n}>
              <article id={`service-${s.n}`} className="grid scroll-mt-28 overflow-hidden rounded-[24px] border border-line bg-white shadow-[var(--shadow-card)] md:grid-cols-2">
                <div className={cn("relative min-h-[240px] bg-paper-2 md:min-h-[360px]", i % 2 && "md:order-2")}>
                  <Image src={unsplash(s.img, 1200)} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col justify-center p-7 md:p-12">
                  <div className="flex items-center gap-4">
                    <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-2"><s.icon size={28} weight="duotone" /></span>
                    <span className="tabular font-display text-lg font-semibold text-steel-2">{s.n}</span>
                  </div>
                  <h2 className="t-h2 mt-6">{s.title}</h2>
                  <p className="t-lead mt-4">{s.text}</p>
                  <ButtonLink href={CTA[i].href} variant="dark" className="mt-8 self-start">
                    {CTA[i].label} <ArrowRightIcon size={16} weight="bold" />
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
