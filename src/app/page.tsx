/**
 * HOMEPAGE (TDR §9–19, ordre final §50) :
 * Hero → Réassurance → Catégories → Produits à la une → Recherche → Profils →
 * Pourquoi SOREMAC → Services → Marques → Qualité → Localisation → CTA.
 * Composant serveur : seules les îles interactives sont des client components.
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Search, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Reassurance } from "@/components/home/Reassurance";
import { SectionHead } from "@/components/home/SectionHead";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Profiles } from "@/components/home/Profiles";
import { ServicesScroll } from "@/components/home/ServicesScroll";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getFeatured, getProduct, productUrl } from "@/lib/catalog/products";
import { SITE, yearsOfExperience } from "@/lib/site";

export default function HomePage() {
  const featured = getFeatured().slice(0, 8);
  const showcase = ["sikalatex", "toiturol", "betonniere-410-litres"].map(getProduct).filter((p) => !!p);

  return (
    <>
      <Hero />
      <Reassurance />

      {/* 04 — Catégories */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            index="01"
            eyebrow="Nos univers"
            title="Tout pour votre chantier."
            intro="Du gros œuvre aux finitions, trouvez rapidement les matériaux et équipements adaptés à votre projet."
            action={<ButtonLink href="/produits" variant="outline">Tout le catalogue <ArrowRight size={16} /></ButtonLink>}
          />
          <CategoryGrid />
        </div>
      </section>

      {/* 05 — Produits à la une */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="02" eyebrow="À la une" title="Les produits recherchés." intro="Les références que nos clients demandent le plus. Choisissez la variante, ajoutez au devis." />
          <Stagger className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featured.map((p) => (
              <StaggerItem key={p.slug} className="flex w-[78vw] shrink-0 snap-start sm:w-auto">
                <ProductCard product={p} className="w-full" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 06 — Recherche */}
      <section className="py-16 md:py-24">
        <Reveal className="container-x">
          <form action="/produits" className="grid gap-6 border border-ink bg-white p-6 md:grid-cols-[1fr_1.4fr] md:items-center md:p-10">
            <div>
              <p className="eyebrow">Recherche</p>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase md:text-5xl">Trouvez la bonne référence.</h2>
            </div>
            <div>
              <label className="relative block">
                <span className="sr-only">Rechercher un produit</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" size={20} />
                <input name="q" type="search" placeholder="Fer 12, Sikalatex, tôle couleur…" className="h-16 w-full border border-line bg-paper pl-12 pr-36 text-lg outline-none focus:border-ink" />
                <button className="absolute right-2 top-1/2 h-12 -translate-y-1/2 bg-ink px-5 text-sm font-semibold text-paper hover:bg-ink-3">Rechercher</button>
              </label>
              <p className="mt-3 text-sm text-steel">Recherchez par produit, marque ou dimension : « Fer 12 » vous amène directement au Ø 12 mm.</p>
            </div>
          </form>
        </Reveal>
      </section>

      {/* 07 — Profils clients */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow="Pour qui" title="Un catalogue pensé pour vous." />
          <Profiles />
        </div>
      </section>

      {/* 08 — Pourquoi SOREMAC */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="eyebrow">04 Pourquoi SOREMAC</p>
            <h2 className="h-section mt-4">L'expérience qui accompagne vos projets.</h2>
            <p className="tabular mt-10 font-display text-[clamp(6rem,16vw,12rem)] font-black leading-[0.8] text-accent">{yearsOfExperience()}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-steel">ans au service de la construction</p>
          </Reveal>
          <Stagger className="grid content-start gap-px bg-line sm:grid-cols-2">
            {[
              { t: "Expérience", d: `Depuis ${SITE.foundedYear}, au service des particuliers et des professionnels.` },
              { t: "Large gamme", d: "Des matériaux du gros œuvre aux équipements et finitions." },
              { t: "Conseil", d: "Une assistance dans le choix des matériaux." },
              { t: "Proximité", d: `Implantation stratégique à ${SITE.address.district}, Cotonou.` },
              { t: "Réactivité", d: "Contacts directs par téléphone, WhatsApp et email." },
            ].map((w, i) => (
              <StaggerItem key={w.t} className={`bg-paper p-6 md:p-8 ${i === 4 ? "sm:col-span-2" : ""}`}>
                <h3 className="font-display text-2xl font-bold uppercase">{w.t}</h3>
                <p className="mt-2 text-steel">{w.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 09 — Services (scroll storytelling GSAP) */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="container-x">
          <SectionHead light index="05" eyebrow="Services" title="Plus que des matériaux. Un accompagnement." />
          <ServicesScroll />
        </div>
      </section>

      {/* 10 — Marques & produits spécifiques — vitrine éditoriale */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="06" eyebrow="Sélection" title="Des produits sélectionnés pour vos travaux." />
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            {showcase.map((p, i) => (
              <Reveal key={p.slug} dir="left" delay={i * 0.08} className={i === 0 ? "lg:row-span-2" : ""}>
                <Link href={productUrl(p)} className={`group relative flex h-full flex-col justify-end overflow-hidden bg-ink p-6 text-paper md:p-10 ${i === 0 ? "min-h-[420px] lg:min-h-[640px]" : "min-h-[300px]"}`}>
                  <Image src={p.gallery[0].src} alt={p.gallery[0].alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                  <div className="img-shade" />
                  <div className="relative">
                    {p.brand && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{p.brand}</p>}
                    <h3 className={`mt-2 font-display font-bold uppercase ${i === 0 ? "text-5xl md:text-7xl" : "text-4xl"}`}>{p.name}</h3>
                    <p className="mt-3 max-w-md text-paper/75">{p.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Voir le produit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-8 font-display text-2xl font-bold uppercase text-steel-2 md:text-3xl">
            {["Sika", "Toiturol", "Cimbenin", "Tôles", "Fers à béton", "Sanitaires", "Carrelages"].map((b) => <span key={b}>{b}</span>)}
          </Reveal>
        </div>
      </section>

      {/* 11 — Authenticité & qualité */}
      <section className="pb-20 md:pb-28">
        <Reveal className="container-x">
          <div className="grid gap-8 bg-paper-2 p-6 md:grid-cols-[auto_1fr_1fr] md:items-center md:p-12">
            <ShieldCheck className="text-accent-2" size={48} strokeWidth={1.4} />
            <div>
              <h2 className="font-display text-4xl font-bold uppercase md:text-5xl">Achetez avec confiance.</h2>
              <p className="mt-3 text-steel">SOREMAC privilégie la qualité des produits et l'authenticité des références distribuées.</p>
            </div>
            <ul className="grid gap-3 text-[15px]">
              <li className="border-l-2 border-accent pl-4"><strong>TOITUROL</strong> — Exigez l'authenticité du produit.</li>
              <li className="border-l-2 border-accent pl-4"><strong>Sika</strong> — Originalité des produits garantie.</li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* 12 — Localisation */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">07 Nous trouver</p>
            <h2 className="h-section mt-4">Retrouvez-nous à Cotonou.</h2>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">Adresse</dt>
                <dd className="mt-2 text-lg">{SITE.address.district} — Quartier {SITE.address.quarter}<br /><span className="text-steel">{SITE.address.landmark}</span><br />{SITE.address.plot}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">Horaires</dt>
                <dd className="mt-2 grid gap-1">
                  {SITE.hours.map((h) => <p key={h.days} className="flex justify-between gap-4"><span>{h.days}</span><span className="tabular text-steel">{h.slots}</span></p>)}
                </dd>
              </div>
            </dl>
            <ButtonLink href={SITE.mapsUrl} variant="dark" className="mt-10"><MapPin size={16} /> Ouvrir dans Google Maps</ButtonLink>
          </Reveal>
          <Reveal delay={0.1} className="relative min-h-[320px] overflow-hidden bg-paper-2">
            <iframe title="Carte — SOREMAC à Vedoko, Cotonou" src={SITE.mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full grayscale-[0.6]" referrerPolicy="no-referrer-when-downgrade" />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
