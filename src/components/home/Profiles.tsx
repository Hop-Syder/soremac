/**
 * 07 — « Un catalogue pensé pour vous » (TDR §13) — 3 profils, photo + promesse + CTA.
 * Motion : reveal horizontal en cascade.
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { whatsappGeneral } from "@/lib/whatsapp";

const u = (id: string) => `https://images.unsplash.com/${id}?w=1000&q=80&auto=format&fit=crop`;

const profiles = [
  { tag: "Particuliers", title: "Vous construisez votre maison ?", text: "Matériaux pour gros œuvre, toiture, plomberie, sanitaire et finition.", cta: "Voir les produits", href: "/produits", img: u("photo-1564013799919-ab600027ffc6") },
  { tag: "Entreprises BTP & artisans", title: "Vous êtes entrepreneur BTP ?", text: "Achetez en détail ou en gros selon vos besoins.", cta: "Explorer le catalogue", href: "/produits", img: u("photo-1541888946425-d81bb19240f5") },
  { tag: "Promoteurs & institutions", title: "Vous êtes promoteur ou entreprise ?", text: "Centralisez vos besoins et demandez un devis personnalisé.", cta: "Parler à SOREMAC", href: whatsappGeneral(), img: u("photo-1503387762-592deb58ef4e") },
];

export function Profiles() {
  return (
    <Stagger className="grid gap-4 md:grid-cols-3">
      {profiles.map((p) => (
        <StaggerItem key={p.title} dir="left">
          <Link href={p.href} className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
            <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
              <Image src={p.img} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold backdrop-blur">{p.tag}</span>
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-7">
              <h3 className="t-h3">{p.title}</h3>
              <p className="mt-2 flex-1 text-steel">{p.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold">
                {p.cta} <ArrowRightIcon size={16} weight="bold" className="text-accent-2 transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
