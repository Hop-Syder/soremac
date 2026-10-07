/**
 * /produits — Catalogue SOREMAC (TDR §21).
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCatalog } from "@/lib/catalog/repo";

export const metadata: Metadata = {
  title: "Catalogue — matériaux de construction",
  description: "Explorez le catalogue SOREMAC : fer à béton, ciment, Sika, tôles, carrelage, sanitaire, équipements de chantier. Devis rapide à Cotonou.",
  alternates: { canonical: "/produits" },
};

export default async function CatalogPage() {
  const { categories, products } = await getCatalog();
  return (
    <>
      <PageHero
        eyebrow={`${products.length} références en ligne · ${categories.length} familles`}
        title="Catalogue SOREMAC"
        intro="Explorez nos matériaux, équipements et produits pour tous vos projets de construction."
        crumbs={[{ name: "Produits", href: "/produits" }]}
      >
        {/* Navigation par familles — vignettes */}
        <nav aria-label="Familles de produits" className="no-scrollbar -mx-5 mt-10 flex gap-3 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          {categories.map((c) => (
            <Link key={c.slug} href={`/produits/${c.slug}`} className="group flex shrink-0 items-center gap-3 rounded-[14px] border border-line bg-white p-2 pr-4 transition-colors hover:border-ink/30">
              <span className="relative size-11 overflow-hidden rounded-[10px] bg-paper-2">
                {c.image && <Image src={c.image} alt="" fill sizes="44px" className="object-cover" />}
              </span>
              <span className="text-sm font-medium">{c.shortName}</span>
            </Link>
          ))}
        </nav>
      </PageHero>
      <section className="shell py-10 md:py-14">
        <Suspense>
          <CatalogExplorer products={products} categories={categories} />
        </Suspense>
      </section>
      <CtaBand title="Vous ne trouvez pas votre référence ?" text="Notre catalogue en ligne s'enrichit progressivement. Envoyez-nous votre liste : nous vérifions la disponibilité pour vous." />
    </>
  );
}
