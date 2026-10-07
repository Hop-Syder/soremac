/**
 * HERO (TDR §9) — le seul moment « spectaculaire » du site, orchestré par GSAP :
 * 1. image apparaît  2. le titre révèle ses lignes  3. sous-titre  4. CTA  5. vignettes produits montent.
 * Parallax léger de l'image via ScrollTrigger (scrub). Désactivé si prefers-reduced-motion.
 * Le contenu est rendu en HTML statique : sans JS, tout reste visible.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_IMG = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=2400&q=80&auto=format&fit=crop";
const chips = [
  { label: "Fer à béton", meta: "Fe400 · Fe500 · Ø6–32", href: "/produits/acier-fer/fer-a-beton" },
  { label: "Sikalatex", meta: "02 L · 05 L · 20 L", href: "/produits/cimenterie-liants/sikalatex" },
  { label: "Bétonnière", meta: "410 litres", href: "/produits/equipements-chantier/betonniere-410-litres" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set("[data-hero]", { autoAlpha: 1 });
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo("[data-hero='media']", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" })
            .fromTo("[data-hero='eyebrow']", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.35)
            .fromTo("[data-hero='line'] > span", { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.09 }, 0.45)
            .set("[data-hero='line']", { autoAlpha: 1 }, 0.45)
            .fromTo("[data-hero='sub']", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.95)
            .fromTo("[data-hero='cta']", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.1)
            .fromTo("[data-hero='chip']", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.25);

          // Parallax léger de l'image
          gsap.to("[data-hero='img']", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
      <div data-hero="media" className="hero-init absolute inset-0 -z-10">
        <div data-hero="img" className="absolute inset-[-8%_0_-8%_0]">
          <Image src={HERO_IMG} alt="Chantier de construction en béton armé à Cotonou" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-x flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14 lg:pt-44">
        <p data-hero="eyebrow" className="hero-init eyebrow text-paper/70!">Matériaux · Équipements · Solutions BTP</p>
        <h1 className="h-display mt-5">
          {["Tout ce qu'il faut", "pour construire.", "Un seul partenaire."].map((l, i) => (
            <span key={l} data-hero="line" className="hero-init block overflow-hidden pb-[0.04em]">
              <span className={`block ${i === 2 ? "text-accent" : ""}`}>{l}</span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p data-hero="sub" className="hero-init max-w-xl text-lg text-paper/75 md:text-xl">
              Découvrez notre catalogue de matériaux, équipements et solutions pour vos projets de construction à Cotonou et au Bénin.
            </p>
            <div data-hero="cta" className="hero-init mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/produits" size="lg">
                Explorer le catalogue <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/devis" variant="outline" size="lg" className="text-paper">Demander un devis</ButtonLink>
              <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-2 py-3 text-sm text-paper/75 underline-offset-4 hover:text-paper hover:underline">
                <WhatsAppIcon size={16} /> Parler sur WhatsApp
              </a>
            </div>
          </div>

          {/* Vignettes produits secondaires */}
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:px-0">
            {chips.map((c) => (
              <li key={c.label} data-hero="chip" className="hero-init shrink-0">
                <Link href={c.href} className="group flex min-w-[220px] items-center justify-between gap-6 border border-paper/15 bg-ink/40 px-4 py-3 backdrop-blur-sm transition-colors hover:border-accent">
                  <span>
                    <span className="block text-sm font-semibold">{c.label}</span>
                    <span className="tabular block text-xs text-paper/55">{c.meta}</span>
                  </span>
                  <ArrowDownRight size={16} className="text-accent transition-transform group-hover:-rotate-45" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.18em] text-paper/45">
          <span>{SITE.address.district} · {SITE.address.quarter} · {SITE.address.city}</span>
          <span className="hidden sm:inline">Depuis {SITE.foundedYear}</span>
        </div>
      </div>
    </section>
  );
}
