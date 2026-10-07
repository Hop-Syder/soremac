/**
 * /conseils — espace éditorial SEO (TDR §39) : article à la une + grille d'articles.
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { articles } from "@/lib/catalog/articles";

export const metadata: Metadata = {
  title: "Conseils — bien choisir ses matériaux",
  description: "Guides pratiques SOREMAC : choisir son fer à béton, Fe400 ou Fe500, carrelage, ciment, tôles de toiture et erreurs à éviter.",
  alternates: { canonical: "/conseils" },
};

export default function TipsPage() {
  const [first, ...rest] = articles;
  return (
    <>
      <PageHero eyebrow="Conseils" title="Bien choisir, bien construire." intro="Guides pratiques pour préparer vos achats et éviter les erreurs courantes." crumbs={[{ name: "Conseils", href: "/conseils" }]} />
      <section className="section">
        <div className="shell">
          <Reveal>
            <Link href={`/conseils/${first.slug}`} className="group grid overflow-hidden rounded-[24px] border border-line bg-white shadow-[var(--shadow-card)] md:grid-cols-2">
              <div className="relative min-h-[260px] overflow-hidden bg-paper-2">
                <Image src={first.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className="flex items-center gap-3 text-sm text-steel"><span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent-2">À la une</span>{first.category}</p>
                <h2 className="t-h2 mt-5">{first.title}</h2>
                <p className="t-lead mt-4">{first.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold">Lire le guide <ArrowRightIcon size={16} weight="bold" className="text-accent-2 transition-transform group-hover:translate-x-1.5" /></span>
              </div>
            </Link>
          </Reveal>

          <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <StaggerItem key={a.slug}>
                <Link href={`/conseils/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                    <Image src={a.image} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-2 text-sm text-steel">{a.category} <span className="text-steel-2">·</span> <ClockIcon size={14} /> {a.readingTime} min</p>
                    <h2 className="t-h3 mt-2">{a.title}</h2>
                    <p className="mt-2 flex-1 text-steel">{a.excerpt}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
