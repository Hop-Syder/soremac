/**
 * /conseils/[slug] — article indexable qui renvoie vers les produits (TDR §39).
 * @hopsyder
 */
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { articles, getArticle } from "@/lib/catalog/articles";
import { getCatalog } from "@/lib/catalog/repo";
import { JsonLd, articleLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, alternates: { canonical: `/conseils/${a.slug}` }, openGraph: { type: "article", images: [a.image] } };
}

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const linked = (await getCatalog()).products.filter((p) => a.productCategories.includes(p.category)).slice(0, 3);
  return (
    <>
      <JsonLd data={articleLd(a)} />
      <PageHero eyebrow={`${a.category} · ${a.readingTime} min de lecture`} title={a.title} intro={a.excerpt} crumbs={[{ name: "Conseils", href: "/conseils" }, { name: a.title, href: `/conseils/${a.slug}` }]} />
      <div className="container-x">
        <div className="relative -mt-6 aspect-[21/9] overflow-hidden bg-paper-2">
          <Image src={a.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      <article className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {a.body.map((b) => (
            <Reveal key={b.heading} className="mb-10">
              <h2 className="font-display text-3xl font-bold uppercase">{b.heading}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </article>
      {linked.length > 0 && (
        <section className="border-t border-line py-16">
          <div className="container-x">
            <h2 className="h-section">Produits liés</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{linked.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
