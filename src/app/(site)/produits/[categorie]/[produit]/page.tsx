/**
 * FICHE PRODUIT — composant central du projet (TDR §24–31).
 * Galerie · informations & variantes · description éditoriale (Présentation, Utilisation,
 * Caractéristiques, Conseils, Documents) · « Besoin d'un conseil ? » · produits associés · JSON-LD Product.
 * @hopsyder
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FilePdfIcon } from "@phosphor-icons/react/ssr";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { SectionHeader } from "@/components/sections/SectionHeader";
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
import { SITE } from "@/lib/site";

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
    openGraph: { images: p.gallery[0] ? [{ url: p.gallery[0].src, alt: p.gallery[0].alt }] : [] },
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
    ...p.variants.map((a) => [`${a.label} disponibles`, `${a.options.join(" · ")}${a.unit ? ` ${a.unit}` : ""}`] as [string, string]),
    ["Catégorie", cat.name],
  ];
  const sections = [
    { id: "presentation", title: "Présentation", body: p.presentation },
    { id: "utilisation", title: "Utilisation", body: p.usage },
    { id: "conseils", title: "Conseils", body: p.advice },
  ].filter((s) => s.body);
  const toc = [...sections.slice(0, 2), { id: "caracteristiques", title: "Caractéristiques" }, ...sections.slice(2), ...(p.documents?.length ? [{ id: "documents", title: "Documents" }] : [])];

  return (
    <>
      <JsonLd data={productLd(p)} />

      {/* Galerie + achat */}
      <section className="pb-16 pt-28 md:pt-36">
        <div className="shell">
          <Breadcrumb items={[{ name: "Produits", href: "/produits" }, { name: cat.name, href: `/produits/${cat.slug}` }, { name: p.name, href: productUrl(p) }]} />
          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Gallery images={p.gallery} name={p.name} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-steel ring-1 ring-line">{cat.name}{p.subcategory ? ` · ${p.subcategory}` : ""}</span>
                {p.badge && <span className="rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-accent-2">{p.badge}</span>}
              </div>
              <h1 className="t-h1 mt-5">{p.name}</h1>
              {p.brand && <p className="mt-3 text-[15px] text-steel">Marque : <span className="font-semibold text-ink">{p.brand}</span></p>}
              <p className="t-lead mt-4">{p.summary}</p>

              {Object.keys(p.specs).length > 0 && (
                <dl className="mt-7 grid grid-cols-2 gap-2">
                  {Object.entries(p.specs).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="rounded-[14px] border border-line bg-white px-4 py-3">
                      <dt className="text-xs text-steel">{k}</dt>
                      <dd className="tabular mt-0.5 font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-8 border-t border-line pt-8">
                <Suspense>
                  <ProductConfigurator product={p} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description éditoriale */}
      <section className="section border-t border-line bg-white">
        <div className="shell grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="Sommaire du produit" className="hidden lg:block">
            <ul className="sticky top-28 grid gap-1 text-[15px]">
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`} className="block rounded-lg px-3 py-2 text-steel transition-colors hover:bg-paper hover:text-ink">{t.title}</a></li>
              ))}
            </ul>
          </nav>

          <div className="grid max-w-3xl gap-14">
            {sections.slice(0, 2).map((s) => (
              <Reveal key={s.id}>
                <h2 id={s.id} className="t-h3 scroll-mt-28">{s.title}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{s.body}</p>
              </Reveal>
            ))}

            <Reveal>
              <h2 id="caracteristiques" className="t-h3 scroll-mt-28">Caractéristiques</h2>
              <div className="mt-4 overflow-hidden rounded-[16px] border border-line">
                <table className="w-full text-left text-[15px]">
                  <tbody>
                    {specs.map(([k, v], i) => (
                      <tr key={k} className={i % 2 ? "bg-white" : "bg-paper/60"}>
                        <th scope="row" className="w-2/5 px-5 py-3.5 font-medium text-steel">{k}</th>
                        <td className="tabular px-5 py-3.5 font-semibold">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-steel">Informations communiquées à titre indicatif. Notre équipe confirme caractéristiques et disponibilité lors du devis.</p>
            </Reveal>

            {sections.slice(2).map((s) => (
              <Reveal key={s.id}>
                <h2 id={s.id} className="t-h3 scroll-mt-28">{s.title}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{s.body}</p>
              </Reveal>
            ))}

            {p.documents?.length ? (
              <Reveal>
                <h2 id="documents" className="t-h3 scroll-mt-28">Documents</h2>
                <ul className="mt-4 grid gap-2">
                  {p.documents.map((d) => (
                    <li key={d.href}>
                      <a href={d.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[14px] border border-line p-4 font-medium hover:border-ink/30">
                        <FilePdfIcon size={24} weight="duotone" className="text-accent-2" /> {d.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* Besoin d'un conseil ? (TDR §30) */}
      <section className="section">
        <Reveal className="shell">
          <div className="flex flex-col gap-8 rounded-[24px] border border-line bg-white p-7 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="t-h2">Vous hésitez entre plusieurs références ?</h2>
              <p className="t-lead mt-3">Notre équipe peut vous orienter selon votre besoin. {SITE.phone}</p>
            </div>
            <ButtonLink href={whatsappProduct(p.name)} variant="whatsapp" size="lg" className="shrink-0"><WhatsAppIcon size={20} /> Parler à un conseiller</ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* Produits associés (TDR §31) */}
      {related.length > 0 && (
        <section className="section pt-0">
          <div className="shell">
            <SectionHeader eyebrow="Pour compléter votre chantier" title="Vous pourriez aussi avoir besoin de…" />
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
