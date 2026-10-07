/**
 * Motion A (Reveal) & Motion B (Stagger) — TDR §34.
 * Le contenu est rendu côté serveur ; l'animation n'est qu'un bonus progressif
 * et se désactive avec prefers-reduced-motion.
 * @hopsyder
 */
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE, RISE, STAGGER } from "./tokens";

type Dir = "up" | "left";

const offset = (dir: Dir) => (dir === "up" ? { y: RISE } : { x: -RISE * 1.5 });

export function Reveal({
  children,
  className,
  delay = 0,
  dir = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  dir?: Dir;
  as?: "div" | "section" | "li" | "header";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset(dir) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: STAGGER } } };
const child = (dir: Dir): Variants => ({
  hidden: { opacity: 0, ...offset(dir) },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
});

export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      variants={parent}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, dir = "up", as = "div" }: { children: ReactNode; className?: string; dir?: Dir; as?: "div" | "li" }) {
  const M = motion[as];
  return (
    <M className={className} variants={child(dir)}>
      {children}
    </M>
  );
}
