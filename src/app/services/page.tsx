/**
 * /services — six grands blocs (TDR §37).
 * @hopsyder
 */
import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { SERVICES } from "@/lib/services";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services — vente, livraison, conseil, devis",
  description: "Vente détail & gros, livraison à Cotonou et environs, conseil technique, devis par WhatsApp, paiement comptant, chèque ou Mobile Money.",
  alternates: { canonical: "/services" },
};

const all = [
  ...SERVICES.map((s, i) => ({ ...s, cta: i === 3 ? { label: "Demander un devis", href: "/devis" } : { label: "Explorer les produits", href: "/produits" } })),
  { n: "06", icon: Handshake, title: "Accompagnement", text: "Un interlocuteur pour suivre vos besoins tout au long du chantier, du gros œuvre aux finitions.", cta: { label: "Nous contacter", href: "/contact" } },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Plus que des matériaux. Un accompagnement." intro="De la sélection des références à la livraison, SOREMAC vous accompagne à chaque étape." crumbs={[{ name: "Services", href: "/services" }]} />
      <section className="py-16 md:py-24">
        <Stagger className="container-x grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {all.map(({ n, icon: Icon, title, text, cta }) => (
            <StaggerItem key={n} className="group flex flex-col bg-paper p-8 transition-colors hover:bg-white md:p-10">
              <div className="flex items-start justify-between">
                <Icon size={36} strokeWidth={1.4} className="text-accent-2 transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="tabular text-sm font-semibold text-steel">{n}</span>
              </div>
              <h2 className="mt-14 font-display text-3xl font-bold uppercase">{title}</h2>
              <p className="mt-3 flex-1 text-steel">{text}</p>
              <ButtonLink href={cta.href} variant="ghost" className="mt-8 self-start">{cta.label} →</ButtonLink>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <CtaBand />
    </>
  );
}
