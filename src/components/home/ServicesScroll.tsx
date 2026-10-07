/**
 * Services — Motion H (scroll storytelling, TDR §15) : panneau gauche collant,
 * services défilant à droite ; le service actif est piloté par GSAP ScrollTrigger.
 * Mobile / reduced-motion : simple liste verticale, toute l'information reste lisible.
 * @hopsyder
 */
"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/motion/tokens";
import { SERVICES } from "@/lib/services";

gsap.registerPlugin(ScrollTrigger, useGSAP);


export function ServicesScroll() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service]").forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
          gsap.fromTo(el, { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 50%", scrub: true } });
        });
        gsap.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-services-list]", start: "top 55%", end: "bottom 55%", scrub: true } });
      });
    },
    { scope: root },
  );

  const Icon = SERVICES[active].icon;

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      {/* Panneau collant */}
      <div className="hidden lg:block">
        <div className="sticky top-28 flex h-[calc(100vh-9rem)] max-h-[640px] flex-col justify-between bg-ink-2 p-10">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-paper/60!">Nos services</p>
            <div className="relative h-40 w-px bg-paper/10">
              <span data-progress className="absolute inset-0 origin-top bg-accent" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
              <Icon className="text-accent" size={40} strokeWidth={1.4} />
              <p className="tabular mt-8 font-display text-[9rem] font-black leading-none text-paper/10">{SERVICES[active].n}</p>
              <p className="-mt-6 font-display text-5xl font-bold uppercase">{SERVICES[active].title}</p>
            </motion.div>
          </AnimatePresence>
          <ButtonLink href="/services" variant="outline" className="self-start text-paper">Tous nos services</ButtonLink>
        </div>
      </div>

      {/* Liste qui défile */}
      <ol data-services-list className="grid">
        {SERVICES.map((s, i) => (
          <li key={s.n} data-service className="border-t border-paper/10 py-10 lg:flex lg:min-h-[52vh] lg:flex-col lg:justify-center lg:py-16">
            <div className="flex items-baseline gap-5">
              <span className={`tabular text-sm font-semibold ${i === active ? "text-accent" : "text-paper/40"} transition-colors`}>{s.n}</span>
              <div>
                <h3 className="font-display text-3xl font-bold uppercase md:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg text-paper/65">{s.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
