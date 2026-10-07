/**
 * Timeline « À propos » (TDR §36) — ligne de progression liée au scroll (Motion useScroll).
 * @hopsyder
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";

const steps = [
  { y: "1995", t: "Création", d: "Naissance de SOREMAC, Société REDA de Matériaux de Construction et de Ciment, à Cotonou." },
  { y: "2008", t: "Nouvelle immatriculation", d: "Immatriculation au RCCM sous le numéro RB/COT/2008-B3899." },
  { y: "Aujourd'hui", t: "Distribution de matériaux et équipements", d: "Un catalogue large, du gros œuvre aux finitions, pour particuliers et professionnels." },
];

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative grid gap-14 pl-8 md:pl-0">
      <span className="absolute bottom-0 left-0 top-0 w-px bg-line md:left-1/2" aria-hidden />
      <motion.span style={{ scaleY }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-accent md:left-1/2" aria-hidden />
      {steps.map((s, i) => (
        <li key={s.y} className={`relative md:grid md:grid-cols-2 md:gap-16 ${i % 2 ? "" : ""}`}>
          <span className="absolute -left-8 top-3 size-2.5 -translate-x-1/2 bg-accent md:left-1/2" aria-hidden />
          <Reveal dir="left" className={i % 2 ? "md:col-start-2" : "md:text-right"}>
            <p className="tabular font-display text-6xl font-black uppercase text-ink md:text-8xl">{s.y}</p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase">{s.t}</h3>
            <p className={`mt-2 max-w-md text-steel ${i % 2 ? "" : "md:ml-auto"}`}>{s.d}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
