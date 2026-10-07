/**
 * 02 — HERO (TDR §9) : message court + visuel de matériaux holographiques.
 * Texte volontairement minimal : titre, une phrase, deux actions. La recherche reste
 * accessible dans le header (⌘K) et dans la section « Recherche intelligente ».
 * Motion (GSAP) : lignes du titre → phrase → CTA → visuel. Neutralisé si prefers-reduced-motion.
 * @hopsyder
 */
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { HoloMaterials } from "./HoloMaterials";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (ctx.conditions?.reduce) return void gsap.set("[data-hero]", { autoAlpha: 1 });
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-hero='eyebrow']", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1)
          .set("[data-hero='line']", { autoAlpha: 1 }, 0.2)
          .fromTo("[data-hero='line'] > span", { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.09 }, 0.2)
          .fromTo("[data-hero='sub']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.6)
          .fromTo("[data-hero='cta']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.72)
          .fromTo("[data-hero='visual']", { autoAlpha: 0, scale: 0.9, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out" }, 0.3);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-14 pt-24 md:pb-20 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(#d9d3c8_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <div className="shell grid items-center gap-6 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className="order-2 lg:order-1">
          <p data-hero="eyebrow" className="hero-init eyebrow">Matériaux de construction · Cotonou</p>

          <h1 className="t-display mt-6">
            <span data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]"><span className="block">Tout pour construire.</span></span>
            <span data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]"><span className="block text-accent-2">Un seul partenaire.</span></span>
          </h1>

          <p data-hero="sub" className="hero-init t-lead mt-6 max-w-md">
            Matériaux, équipements et conseils pour vos chantiers, depuis 1995.
          </p>

          <div data-hero="cta" className="hero-init mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/produits" variant="dark" size="lg">
              Explorer le catalogue <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/devis" size="lg">Demander un devis</ButtonLink>
          </div>
        </div>

        <div data-hero="visual" className="hero-init order-1 mx-auto -mb-8 w-full max-w-[330px] sm:-my-4 sm:max-w-[480px] lg:order-2 lg:my-0 lg:max-w-none">
          <HoloMaterials />
        </div>
      </div>
    </section>
  );
}
