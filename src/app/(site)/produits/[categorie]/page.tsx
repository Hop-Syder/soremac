/**
 * /produits/[categorie] — page catégorie indexable (TDR §63) : bannière, produits filtrables,
 * familles associées (maillage interne SEO).
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { findCategory, getCatalog, productsIn } from "@/lib/catalog/repo";
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
    openGraph: { images: cat.image ? [cat.image] : [] },
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
      <section className="pt-28 md:pt-36">
        <div className="shell">
          <Breadcrumb items={[{ name: "Produits", href: "/produits" }, { name: cat.name, href: `/produits/${cat.slug}` }]} />
          <Reveal className="relative mt-6 overflow-hidden rounded-[28px] bg-ink text-white">
            {cat.image && <Image src={cat.image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
            <div className="relative px-6 py-14 sm:px-10 md:py-20 lg:px-14">
              <p className="eyebrow eyebrow-dark">{list.length} produit{list.length > 1 ? "s" : ""} en ligne</p>
              <h1 className="t-h1 mt-5 max-w-3xl">{cat.name}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/70">{cat.description}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell py-10 md:py-14">
        {list.length ? (
          <Suspense>
            <CatalogExplorer products={list} categories={catalog.categories} lockedCategory={cat.slug} />
          </Suspense>
        ) : (
          <div className="rounded-[20px] border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
            <p className="t-h3">Références en cours de mise en ligne.</p>
            <p className="mx-auto mt-2 max-w-lg text-steel">Cette famille est disponible en magasin. Contactez notre équipe pour connaître les références et vérifier la disponibilité.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href={whatsappGeneral()} variant="whatsapp"><WhatsAppIcon size={18} /> Demander sur WhatsApp</ButtonLink>
              <ButtonLink href="/devis" variant="outline">Demander un devis</ButtonLink>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <nav aria-label="Familles associées" className="mt-16">
            <h2 className="t-h3">Souvent associé à</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/produits/${r.slug}`} className="group flex items-center gap-3 rounded-[14px] border border-line bg-white p-2.5 pr-4 transition-colors hover:border-ink/30">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-paper-2">{r.image && <Image src={r.image} alt="" fill sizes="56px" className="object-cover" />}</span>
                    <span className="flex-1 font-medium">{r.name}</span>
                    <ArrowUpRightIcon size={16} className="text-steel-2 transition-colors group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
      <CtaBand />
    </>
  );
}
