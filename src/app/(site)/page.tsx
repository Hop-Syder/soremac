/**
 * HOMEPAGE — ordre du TDR §50 :
 * 01 Header · 02 Hero · 03 Réassurance · 04 Catégories · 05 Produits à la une · 06 Recherche ·
 * 07 Profils · 08 Pourquoi SOREMAC · 09 Services · 10 Sélection & marques · 11 Qualité ·
 * 12 Localisation · 13 CTA devis/WhatsApp · 14 Footer
 * « Qui vous êtes → ce que vous vendez → comment chercher → pourquoi nous faire confiance → comment nous contacter. »
 * @hopsyder
 */
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Hero } from "@/components/home/Hero";
import { Reassurance } from "@/components/home/Reassurance";
import { CategoryBento } from "@/components/home/CategoryBento";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SmartSearch } from "@/components/home/SmartSearch";
import { Profiles } from "@/components/home/Profiles";
import { WhySoremac } from "@/components/home/WhySoremac";
import { ServicesScroll } from "@/components/home/ServicesScroll";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { Quality } from "@/components/home/Quality";
import { Location } from "@/components/home/Location";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { featured as featuredOf, findProduct, getCatalog } from "@/lib/catalog/repo";

export default async function HomePage() {
  const catalog = await getCatalog();
  const featured = featuredOf(catalog);
  const counts = Object.fromEntries(catalog.categories.map((c) => [c.slug, catalog.products.filter((p) => p.category === c.slug).length]));
  const picked = ["sikalatex", "toiturol", "betonniere-410-litres"].map((s) => findProduct(catalog, s)).filter((p) => !!p);
  const showcase = picked.length === 3 ? picked : featured.slice(0, 3);

  return (
    <>
      {/* 02 */}
      <Hero />

      {/* 03 */}
      <Reassurance />

      {/* 04 — Catégories */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            eyebrow={`${catalog.categories.length} familles de produits`}
            title="Tout pour votre chantier."
            intro="Du gros œuvre aux finitions, trouvez rapidement les matériaux et équipements adaptés à votre projet."
            action={<ButtonLink href="/produits" variant="outline">Tout le catalogue <ArrowRightIcon size={16} weight="bold" /></ButtonLink>}
          />
          <CategoryBento categories={catalog.categories.slice(0, 11)} counts={counts} />
        </div>
      </section>

      {/* 05 — Produits à la une */}
      <section className="section bg-white">
        <div className="shell">
          <SectionHeader
            eyebrow="À la une"
            title="Les produits recherchés."
            intro="Les références que nos clients demandent le plus. Choisissez votre variante et ajoutez-la à votre devis."
          />
          <FeaturedProducts products={featured} />
        </div>
      </section>

      {/* 06 — Recherche */}
      <section className="section">
        <div className="shell"><SmartSearch products={catalog.products} /></div>
      </section>

      {/* 07 — Profils clients */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeader eyebrow="Pour qui ?" title="Un catalogue pensé pour vous." intro="Particulier, artisan, entreprise ou promoteur : une seule adresse, le bon accompagnement." />
          <Profiles />
        </div>
      </section>

      {/* 08 — Pourquoi SOREMAC */}
      <section className="section bg-white">
        <div className="shell">
          <SectionHeader eyebrow="Pourquoi SOREMAC" title="L'expérience qui accompagne vos projets." />
          <WhySoremac />
        </div>
      </section>

      {/* 09 — Services */}
      <section className="section bg-ink">
        <div className="shell">
          <SectionHeader tone="dark" eyebrow="Services" title="Plus que des matériaux. Un accompagnement." />
          <ServicesScroll />
        </div>
      </section>

      {/* 10 — Sélection & marques */}
      <section className="section">
        <div className="shell">
          <SectionHeader eyebrow="Sélection" title="Des produits sélectionnés pour vos travaux." />
          <BrandShowcase products={showcase} />
        </div>
      </section>

      {/* 11 — Qualité */}
      <section className="pb-[var(--section-y)]">
        <div className="shell"><Quality /></div>
      </section>

      {/* 12 — Localisation */}
      <section className="pb-[var(--section-y)]">
        <div className="shell"><Location /></div>
      </section>

      {/* 13 — CTA */}
      <CtaBand />
    </>
  );
}
