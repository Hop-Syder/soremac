/**
 * 02 — HERO (TDR §9). Objectif : comprendre SOREMAC en 5 secondes, puis chercher ou demander un devis.
 * Gauche : message, CTA, recherche intégrée. Droite : photographie + vignettes produits flottantes.
 * Motion (GSAP, seul moment « spectaculaire ») : image → lignes du titre → sous-titre → CTA → vignettes,
 * puis parallax léger de l'image au scroll. Neutralisé si prefers-reduced-motion ; sans JS tout reste visible.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRightIcon, MagnifyingGlassIcon, TruckIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_IMG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80&auto=format&fit=crop";
const QUICK = ["Fer 12", "Ciment", "Sikalatex", "Tôle", "Carrelage"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (ctx.conditions?.reduce) return void gsap.set("[data-hero]", { autoAlpha: 1 });
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-hero='media']", { autoAlpha: 0, scale: 0.94, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.1 })
          .fromTo("[data-hero='eyebrow']", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.15)
          .set("[data-hero='line']", { autoAlpha: 1 }, 0.25)
          .fromTo("[data-hero='line'] > span", { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, 0.25)
          .fromTo("[data-hero='sub']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7)
          .fromTo("[data-hero='cta']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.82)
          .fromTo("[data-hero='search']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.94)
          .fromTo("[data-hero='float']", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.0);

        gsap.to("[data-hero='img']", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-16 pt-28 md:pt-40 lg:pb-24">
      {/* Trame technique très discrète */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(#d9d3c8_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <p data-hero="eyebrow" className="hero-init eyebrow">Matériaux · Équipements · Solutions BTP</p>

          <h1 className="t-display mt-6">
            {["Tout ce qu'il faut", "pour construire."].map((l) => (
              <span key={l} data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]">
                <span className="block">{l}</span>
              </span>
            ))}
            <span data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]">
              <span className="block text-accent-2">Un seul partenaire.</span>
            </span>
          </h1>

          <p data-hero="sub" className="hero-init t-lead mt-7 max-w-xl">
            Découvrez notre catalogue de matériaux, équipements et solutions pour vos projets de construction à Cotonou et au Bénin.
          </p>

          <div data-hero="cta" className="hero-init mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/produits" variant="dark" size="lg">
              Explorer le catalogue <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/devis" size="lg">Demander un devis</ButtonLink>
            <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-3 py-3 text-[15px] font-medium text-steel transition-colors hover:text-ink">
              <WhatsAppIcon size={18} className="text-whatsapp" /> Parler sur WhatsApp
            </a>
          </div>

          {/* Recherche intégrée */}
          <form
            data-hero="search"
            className="hero-init mt-10 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q")?.toString().trim();
              router.push(q ? `/produits?q=${encodeURIComponent(q)}` : "/produits");
            }}
          >
            <label className="relative block">
              <span className="sr-only">Rechercher un produit</span>
              <MagnifyingGlassIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit, une marque, une dimension..."
                className="h-14 w-full rounded-[12px] border border-line bg-white pl-12 pr-32 text-[15.5px] shadow-[var(--shadow-card)] outline-none transition-colors placeholder:text-steel-2 focus:border-ink/40"
              />
              <button className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-[9px] bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-3">Rechercher</button>
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-steel-2">Populaire :</span>
              {QUICK.map((q) => (
                <Link key={q} href={`/produits?q=${encodeURIComponent(q)}`} className="rounded-full border border-line bg-white/70 px-3 py-1 text-steel transition-colors hover:border-ink/30 hover:text-ink">{q}</Link>
              ))}
            </div>
          </form>
        </div>

        {/* Visuel */}
        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div data-hero="media" className="hero-init relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2 shadow-[var(--shadow-lift)] sm:aspect-[5/5.4]">
            <div data-hero="img" className="absolute inset-[-8%_0]">
              <Image src={HERO_IMG} alt="Fers à béton et matériaux sur un chantier à Cotonou" fill priority sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent" />
          </div>

          {/* Vignettes flottantes */}
          <Link
            data-hero="float"
            href="/produits/acier-fer/fer-a-beton"
            className="hero-init absolute -left-3 bottom-8 flex w-[250px] items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur transition-transform hover:-translate-y-1 sm:-left-8"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent-2">Ø12</span>
            <span className="min-w-0">
              <span className="block text-[11.5px] text-steel">Le plus demandé</span>
              <span className="block truncate font-semibold">Fer à béton Fe500</span>
              <span className="tabular block text-xs text-steel">Ø 6 → 32 mm</span>
            </span>
          </Link>

          <div data-hero="float" className="hero-init absolute -right-2 top-8 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur sm:-right-6">
            <p className="tabular font-display text-3xl font-bold leading-none tracking-tight">{new Date().getFullYear() - SITE.foundedYear}+</p>
            <p className="mt-1 text-xs text-steel">ans d'expérience</p>
          </div>

          <div data-hero="float" className="hero-init absolute bottom-[-18px] right-6 hidden items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-[var(--shadow-lift)] sm:flex">
            <span className="grid size-9 place-items-center rounded-full bg-white/10"><TruckIcon size={18} className="text-accent" /></span>
            <span className="text-sm leading-tight">Livraison<br /><span className="text-white/60">Cotonou & environs</span></span>
          </div>
        </div>
      </div>

    </section>
  );
}
