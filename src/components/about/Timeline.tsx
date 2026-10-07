/**
 * Timeline « À propos » (TDR §36) — ligne de progression liée au scroll (Motion useScroll).
 * @hopsyder
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

const steps = [
  { y: String(SITE.foundedYear), t: "Création", d: "Naissance de SOREMAC, Société REDA de Matériaux de Construction et de Ciment, à Cotonou." },
  { y: String(SITE.rccmYear), t: "Nouvelle immatriculation", d: `Immatriculation au RCCM sous le numéro ${SITE.legal.rccm}.` },
  { y: "Aujourd'hui", t: "Distribution de matériaux et équipements", d: "Un catalogue large, du gros œuvre aux finitions, pour particuliers et professionnels." },
];

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative grid gap-12 pl-10 md:gap-20">
      <span className="absolute bottom-2 left-[11px] top-2 w-[2px] rounded-full bg-line" aria-hidden />
      <motion.span style={{ scaleY }} className="absolute bottom-2 left-[11px] top-2 w-[2px] origin-top rounded-full bg-accent" aria-hidden />
      {steps.map((s) => (
        <li key={s.y} className="relative">
          <span className="absolute -left-10 top-3 grid size-6 place-items-center rounded-full border-2 border-accent bg-paper" aria-hidden>
            <span className="size-2 rounded-full bg-accent" />
          </span>
          <Reveal dir="left" className="grid gap-3 md:grid-cols-[260px_1fr] md:gap-10">
            <p className="tabular font-display text-5xl font-bold tracking-[-0.04em] md:text-6xl">{s.y}</p>
            <div className="md:pt-2">
              <h3 className="t-h3">{s.t}</h3>
              <p className="mt-2 max-w-xl text-lg text-steel">{s.d}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
