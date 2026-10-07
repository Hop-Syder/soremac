/**
 * 09 — Services (TDR §15) — Motion H, la séquence de scroll storytelling du site.
 * Desktop : panneau gauche collant (photo + numéro + titre du service actif), liste qui défile à droite,
 * service actif piloté par GSAP ScrollTrigger, barre de progression liée au scroll.
 * Mobile / reduced-motion : liste de cartes, toute l'information reste lisible.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { SERVICES, unsplash } from "@/lib/services";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ServicesScroll() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service]").forEach((el, i) => {
          ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
        });
        gsap.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-services-list]", start: "top 55%", end: "bottom 55%", scrub: true } });
      });
    },
    { scope: root },
  );

  const S = SERVICES[active];

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      {/* Panneau collant (desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-28 h-[calc(100vh-9rem)] max-h-[620px] overflow-hidden rounded-[28px] bg-ink-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <Image src={unsplash(S.img)} alt="" fill sizes="45vw" className="object-cover opacity-60" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="absolute left-8 top-8 h-32 w-[3px] overflow-hidden rounded-full bg-white/15">
            <span data-progress className="block h-full w-full origin-top bg-accent" />
          </div>
          <div className="absolute inset-x-8 bottom-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-ink"><S.icon size={28} weight="duotone" /></span>
                <p className="mt-6 font-display text-[2.6rem] font-bold leading-none tracking-[-0.04em] text-white">{S.title}</p>
                <p className="tabular mt-3 text-sm text-white/55">{S.n} / {String(SERVICES.length).padStart(2, "0")}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Liste */}
      <ol data-services-list className="grid gap-3 lg:gap-0">
        {SERVICES.map(({ n, icon: Icon, title, text }, i) => (
          <li
            key={n}
            data-service
            className={cn(
              "rounded-[20px] border border-white/10 bg-white/[0.04] p-6 transition-opacity duration-500",
              "lg:flex lg:min-h-[44vh] lg:flex-col lg:justify-center lg:rounded-none lg:border-0 lg:border-t lg:bg-transparent lg:px-0 lg:py-12",
              i === active ? "lg:opacity-100" : "lg:opacity-35",
            )}
          >
            <div className="flex items-start gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-accent lg:hidden"><Icon size={24} weight="duotone" /></span>
              <div>
                <span className="tabular hidden text-sm font-semibold text-accent lg:block">{n}</span>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white md:text-4xl lg:mt-3">{title}</h3>
                <p className="mt-3 max-w-md text-[16px] text-white/65 md:text-lg">{text}</p>
              </div>
            </div>
          </li>
        ))}
        <li className="pt-6 lg:border-t lg:border-white/10 lg:pt-10">
          <ButtonLink href="/services" variant="light">Découvrir nos services</ButtonLink>
        </li>
      </ol>
    </div>
  );
}
