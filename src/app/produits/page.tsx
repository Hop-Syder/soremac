/**
 * /produits — Catalogue SOREMAC (TDR §21).
 * @hopsyder
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { categories } from "@/lib/catalog/categories";
import { published } from "@/lib/catalog/products";

export const metadata: Metadata = {
  title: "Catalogue — matériaux de construction",
  description: "Explorez le catalogue SOREMAC : fer à béton, ciment, Sika, tôles, carrelage, sanitaire, équipements de chantier. Devis rapide à Cotonou.",
  alternates: { canonical: "/produits" },
};

export default function CatalogPage() {
  return (
    <>
      <PageHero
        eyebrow={`${published.length} références en ligne · ${categories.length} familles`}
        title="Catalogue SOREMAC"
        intro="Explorez nos matériaux, équipements et produits pour tous vos projets de construction."
        crumbs={[{ name: "Produits", href: "/produits" }]}
      >
        <nav aria-label="Familles de produits" className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <Link key={c.slug} href={`/produits/${c.slug}`} className="shrink-0 border border-paper/15 px-3.5 py-2 text-sm text-paper/80 transition-colors hover:border-accent hover:text-paper">
              {c.name}
            </Link>
          ))}
        </nav>
      </PageHero>
      <section className="container-x py-8 md:py-14">
        <Suspense>
          <CatalogExplorer products={published} />
        </Suspense>
      </section>
      <CtaBand title="Vous ne trouvez pas votre référence ?" text="Notre catalogue en ligne s'enrichit progressivement. Envoyez-nous votre liste : nous vérifions la disponibilité pour vous." />
    </>
  );
}
