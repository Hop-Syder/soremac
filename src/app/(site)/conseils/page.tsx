/**
 * /conseils — espace éditorial SEO (TDR §39).
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
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
      <section className="py-16 md:py-24">
        <div className="container-x">
          <Link href={`/conseils/${first.slug}`} className="group grid gap-6 border-b border-line pb-12 md:grid-cols-2 md:items-center md:gap-12">
            <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
              <Image src={first.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            </div>
            <div>
              <p className="eyebrow">{first.category} · {first.readingTime} min</p>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase md:text-6xl">{first.title}</h2>
              <p className="mt-4 text-lg text-steel">{first.excerpt}</p>
              <span className="mt-6 inline-block font-semibold underline underline-offset-4">Lire le guide</span>
            </div>
          </Link>
          <Stagger className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <StaggerItem key={a.slug}>
                <Link href={`/conseils/${a.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                    <Image src={a.image} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">{a.category} · {a.readingTime} min</p>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase group-hover:underline group-hover:underline-offset-4">{a.title}</h2>
                  <p className="mt-2 text-steel">{a.excerpt}</p>
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
