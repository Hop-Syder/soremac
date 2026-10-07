/**
 * /produits/[categorie]/[produit] — FICHE PRODUIT, composant central (TDR §24–31).
 * Galerie · infos · variantes · caractéristiques · description éditoriale ·
 * conseil · produits associés · JSON-LD Product.
 * @hopsyder
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FileText } from "lucide-react";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { Gallery } from "@/components/product/Gallery";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { productUrl } from "@/lib/catalog/products";
import { findCategory, findProduct, getCatalog, relatedTo } from "@/lib/catalog/repo";
import { JsonLd, productLd } from "@/lib/seo";
import { whatsappProduct } from "@/lib/whatsapp";

type Props = { params: Promise<{ categorie: string; produit: string }> };

// Pré-rendu des fiches connues ; les nouvelles fiches publiées depuis l'admin sont rendues à la demande.
export const generateStaticParams = async () => (await getCatalog()).products.map((p) => ({ categorie: p.category, produit: p.slug }));

async function load(params: Props["params"]) {
  const { categorie, produit } = await params;
  const catalog = await getCatalog();
  const product = findProduct(catalog, produit);
  return product && product.category === categorie ? { product, catalog } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loaded = await load(params);
  if (!loaded) return {};
  const { product: p, catalog } = loaded;
  const cat = findCategory(catalog, p.category);
  return {
    title: p.seoTitle ? { absolute: `${p.seoTitle} | SOREMAC` } : `${p.name} — ${cat?.name} à Cotonou`,
    description: p.seoDescription ?? `${p.summary} Disponible chez SOREMAC à Cotonou. Prix sur demande, devis rapide sur WhatsApp.`,
    alternates: { canonical: productUrl(p) },
    openGraph: { images: [{ url: p.gallery[0].src, alt: p.gallery[0].alt }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const loaded = await load(params);
  if (!loaded) notFound();
  const { product: p, catalog } = loaded;
  const cat = findCategory(catalog, p.category)!;
  const related = relatedTo(catalog, p);

  const specs: [string, string][] = [
    ...Object.entries(p.specs),
    ...(p.brand && !p.specs.Marque ? [["Marque", p.brand] as [string, string]] : []),
    ...(p.packaging ? [["Conditionnement", p.packaging] as [string, string]] : []),
    ["Catégorie", cat.name],
  ];

  const sections = [
    { id: "presentation", title: "Présentation", body: p.presentation },
    { id: "utilisation", title: "Utilisation", body: p.usage },
    { id: "conseils", title: "Conseils", body: p.advice },
  ].filter((s) => s.body);

  return (
    <>
      <JsonLd data={productLd(p)} />
      <div className="container-x pb-16 pt-24 md:pt-32">
        <Breadcrumb items={[{ name: "Produits", href: "/produits" }, { name: cat.name, href: `/produits/${cat.slug}` }, { name: p.name, href: productUrl(p) }]} />

        <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Gallery images={p.gallery} name={p.name} />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">
              {cat.name}{p.subcategory ? ` · ${p.subcategory}` : ""}
            </p>
            <h1 className="mt-3 text-[clamp(2.6rem,5vw,4.5rem)] font-extrabold uppercase">{p.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {p.brand && <span className="border border-ink px-2 py-0.5 text-xs font-bold uppercase tracking-wider">{p.brand}</span>}
              {p.badge && <span className="bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider">{p.badge}</span>}
            </div>
            <p className="mt-5 text-lg text-steel">{p.summary}</p>

            {/* Caractéristiques principales en grille compacte */}
            <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
              {Object.entries(p.specs).slice(0, 4).map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-steel">{k}</dt>
                  <dd className="tabular mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <Suspense>
                <ProductConfigurator product={p} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Description éditoriale + tableau des caractéristiques */}
      <section className="border-t border-line bg-white py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="grid gap-10">
            {sections.map((s) => (
              <Reveal key={s.id}>
                <h2 id={s.id} className="font-display text-3xl font-bold uppercase">{s.title}</h2>
                <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/80">{s.body}</p>
              </Reveal>
            ))}
            {p.documents?.length ? (
              <Reveal>
                <h2 className="font-display text-3xl font-bold uppercase">Documents</h2>
                <ul className="mt-3 grid gap-2">
                  {p.documents.map((d) => (
                    <li key={d.href}><a href={d.href} className="inline-flex items-center gap-2 underline underline-offset-4"><FileText size={16} /> {d.label}</a></li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
          <Reveal>
            <h2 className="font-display text-3xl font-bold uppercase">Caractéristiques</h2>
            <table className="mt-4 w-full border-collapse text-left">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-line">
                    <th scope="row" className="w-2/5 py-3.5 pr-4 text-sm font-medium text-steel">{k}</th>
                    <td className="tabular py-3.5 font-semibold">{v}</td>
                  </tr>
                ))}
                {p.variants.map((a) => (
                  <tr key={a.key} className="border-b border-line">
                    <th scope="row" className="py-3.5 pr-4 text-sm font-medium text-steel">{a.label} disponibles</th>
                    <td className="tabular py-3.5 font-semibold">{a.options.join(" · ")}{a.unit && a.key !== "grade" ? ` ${a.unit}` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-steel">Informations communiquées à titre indicatif. Notre équipe confirme les caractéristiques et la disponibilité lors du devis.</p>
          </Reveal>
        </div>
      </section>

      {/* Besoin d'un conseil ? (TDR §30) */}
      <section className="bg-ink py-14 text-paper md:py-20">
        <Reveal className="container-x flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase md:text-5xl">Vous hésitez entre plusieurs références ?</h2>
            <p className="mt-3 text-lg text-paper/70">Notre équipe peut vous orienter selon votre besoin.</p>
          </div>
          <ButtonLink href={whatsappProduct(p.name)} variant="whatsapp" size="lg" className="shrink-0"><WhatsAppIcon /> Parler à un conseiller</ButtonLink>
        </Reveal>
      </section>

      {/* Produits associés (TDR §31) */}
      {related.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container-x">
            <Reveal><h2 className="h-section">Vous pourriez aussi avoir besoin de…</h2></Reveal>
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <StaggerItem key={r.slug} className="flex"><ProductCard product={r} className="w-full" /></StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
