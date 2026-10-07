/**
 * Catégories en grille éditoriale asymétrique (TDR §11) — pas 11 cartes identiques.
 * Hover : image +4 %, texte glisse, flèche apparaît, overlay discret.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/catalog/categories";
import { cn } from "@/lib/cn";
import { EASE, STAGGER } from "@/components/motion/tokens";

const span: Record<string, string> = {
  xl: "col-span-2 row-span-2 lg:col-span-6 lg:row-span-2",
  lg: "col-span-2 lg:col-span-3 lg:row-span-2",
  md: "col-span-1 lg:col-span-3",
  sm: "col-span-1 lg:col-span-3",
};

export function CategoryGrid() {
  const reduce = useReducedMotion();
  return (
    <ul className="grid grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-2 md:auto-rows-[220px] lg:grid-cols-12 lg:gap-3">
      {categories.map((c, i) => (
        <motion.li
          key={c.slug}
          className={span[c.size]}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.6, ease: EASE, delay: (i % 6) * STAGGER }}
        >
          <Link href={`/produits/${c.slug}`} className="group relative flex h-full flex-col justify-end overflow-hidden bg-ink p-4 text-paper md:p-6">
            <Image src={c.image} alt="" fill sizes={c.size === "xl" ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} className="object-cover opacity-80 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.045] group-hover:opacity-65" />
            <div className="img-shade" />
            <span className="tabular absolute left-4 top-4 text-[11px] font-semibold text-paper/60 md:left-6 md:top-5">{String(i + 1).padStart(2, "0")}</span>
            <span className="absolute right-4 top-4 grid size-9 translate-y-1 place-items-center bg-accent text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:right-5 md:top-5">
              <ArrowUpRight size={18} />
            </span>
            <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1">
              <h3 className={cn("font-display font-bold uppercase leading-[0.95]", c.size === "xl" ? "text-4xl md:text-6xl" : c.size === "sm" ? "text-lg md:text-xl" : "text-2xl md:text-3xl")}>{c.name}</h3>
              {(c.size === "xl" || c.size === "lg") && <p className="mt-2 hidden max-w-sm text-sm text-paper/70 sm:block">{c.description}</p>}
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
