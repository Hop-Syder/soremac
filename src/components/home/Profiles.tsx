/**
 * Section « Un catalogue pensé pour vous » (TDR §13) — reveal horizontal.
 * @hopsyder
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { whatsappGeneral } from "@/lib/whatsapp";

const profiles = [
  { n: "01", title: "Vous construisez votre maison ?", text: "Matériaux pour gros œuvre, toiture, plomberie, sanitaire et finition.", cta: "Voir les produits", href: "/produits" },
  { n: "02", title: "Vous êtes entrepreneur BTP ?", text: "Achetez en détail ou en gros selon vos besoins.", cta: "Explorer le catalogue", href: "/produits" },
  { n: "03", title: "Vous êtes promoteur ou entreprise ?", text: "Centralisez vos besoins et demandez un devis personnalisé.", cta: "Parler à SOREMAC", href: whatsappGeneral() },
];

export function Profiles() {
  return (
    <Stagger className="grid gap-px bg-line md:grid-cols-3">
      {profiles.map((p) => (
        <StaggerItem key={p.n} dir="left" className="bg-paper">
          <Link href={p.href} className="group flex h-full flex-col p-6 transition-colors hover:bg-white md:p-8 lg:p-10">
            <span className="tabular text-sm font-semibold text-accent-2">{p.n}</span>
            <h3 className="mt-10 font-display text-3xl font-bold uppercase md:mt-16 md:text-[2.4rem]">{p.title}</h3>
            <p className="mt-4 text-steel">{p.text}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              {p.cta} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
