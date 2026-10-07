/**
 * /produits/[categorie] — page catégorie indexable (TDR §63).
 * @hopsyder
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { findCategory, getCatalog, productsIn } from "@/lib/catalog/repo";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappGeneral } from "@/lib/whatsapp";

type Props = { params: Promise<{ categorie: string }> };

// Pré-rendu des catégories connues ; les nouvelles (créées dans l'admin) sont rendues à la demande.
export const generateStaticParams = async () => (await getCatalog()).categories.map((c) => ({ categorie: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = findCategory(await getCatalog(), (await params).categorie);
  if (!cat) return {};
  return {
    title: cat.seoTitle ? { absolute: cat.seoTitle } : `${cat.name} à Cotonou`,
    description: cat.seoDescription ?? `${cat.name} chez SOREMAC à Cotonou : ${cat.description} Vente détail & gros, devis rapide.`,
    alternates: { canonical: `/produits/${cat.slug}` },
    openGraph: { images: [cat.image] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const catalog = await getCatalog();
  const cat = findCategory(catalog, (await params).categorie);
  if (!cat) notFound();
  const list = productsIn(catalog, cat.slug);
  const related = cat.related.map((s) => findCategory(catalog, s)).filter((c) => !!c);

  return (
    <>
      <PageHero
        eyebrow="Famille de produits"
        title={cat.name}
        intro={cat.description}
        crumbs={[{ name: "Produits", href: "/produits" }, { name: cat.name, href: `/produits/${cat.slug}` }]}
      />
      <section className="container-x py-8 md:py-14">
        {list.length ? (
          <Suspense>
            <CatalogExplorer products={list} categories={catalog.categories} lockedCategory={cat.slug} />
          </Suspense>
        ) : (
          <div className="border border-dashed border-line bg-white px-6 py-14 text-center">
            <p className="font-display text-3xl font-bold uppercase">Références en cours de mise en ligne.</p>
            <p className="mx-auto mt-3 max-w-lg text-steel">Cette famille est disponible en magasin. Contactez notre équipe pour connaître les références et vérifier la disponibilité.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href={whatsappGeneral()} variant="whatsapp">Demander sur WhatsApp</ButtonLink>
              <ButtonLink href="/devis" variant="outline">Demander un devis</ButtonLink>
            </div>
          </div>
        )}
        {related.length > 0 && (
          <nav aria-label="Familles associées" className="mt-16 border-t border-line pt-8">
            <p className="eyebrow">Souvent associé à</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}><Link href={`/produits/${r.slug}`} className="block border border-line bg-white px-4 py-2.5 text-sm font-medium hover:border-ink">{r.name}</Link></li>
              ))}
            </ul>
          </nav>
        )}
      </section>
      <CtaBand />
    </>
  );
}
