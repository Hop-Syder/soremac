/**
 * 06 — Catalogue / recherche (TDR §21, Objectif 2) : démonstration interactive de la recherche.
 * « Fer 12 » trouve le fer à béton et présélectionne Ø 12 mm ; « Sikalatex 20 litres » → 20 L.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, MagnifyingGlassIcon, SparkleIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { preselectQuery, searchProducts } from "@/lib/catalog/search";
import { productUrl } from "@/lib/catalog/products";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

const EXAMPLES = ["Fer 12", "Sikalatex 20 litres", "Fe400 16", "Tôle", "Lavabo", "Bétonnière"];

export function SmartSearch({ products }: { products: Product[] }) {
  const [q, setQ] = useState("Fer 12");
  const hits = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 3) : []), [products, q]);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
      <Reveal>
        <h2 className="t-h2">Trouvez la bonne référence. Comme vous la demanderiez au comptoir.</h2>
        <p className="t-lead mt-5">
          Tapez un produit, une marque ou une dimension : la recherche comprend « Fer 12 » et vous amène directement au bon diamètre.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => setQ(e)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors", q === e ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40")}
            >
              {e}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded-[24px] border border-line bg-white p-3 shadow-[var(--shadow-lift)] sm:p-4">
          <label className="relative block">
            <span className="sr-only">Essayer la recherche</span>
            <MagnifyingGlassIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une marque, une dimension..."
              className="h-14 w-full rounded-[14px] bg-paper pl-12 pr-4 text-[16px] outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <ul className="mt-2 grid min-h-[176px] content-start gap-1" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {hits.map(({ product, preselect }, i) => (
                <motion.li
                  key={product.slug + q}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                >
                  <Link href={productUrl(product) + preselectQuery(preselect)} className="group flex items-center gap-4 rounded-[14px] p-2.5 transition-colors hover:bg-paper">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-paper-2">
                      {product.gallery[0] && <Image src={product.gallery[0].src} alt="" fill sizes="64px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{product.name}</span>
                      <span className="block truncate text-sm text-steel">{product.categoryName}</span>
                    </span>
                    {Object.keys(preselect).length > 0 && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-2">
                        <SparkleIcon size={12} weight="fill" /> {Object.values(preselect).join(" · ")}
                      </span>
                    )}
                    <ArrowRightIcon size={16} className="shrink-0 text-steel-2 transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
            {q.trim() && !hits.length && (
              <li className="grid place-items-center px-6 py-14 text-center">
                <p className="font-semibold">Aucun produit ne correspond à votre recherche.</p>
                <p className="mt-1 text-sm text-steel">Essayez une autre référence ou contactez notre équipe.</p>
              </li>
            )}
          </ul>

          <Link href={`/produits${q.trim() ? `?q=${encodeURIComponent(q)}` : ""}`} className="mt-2 flex items-center justify-between rounded-[14px] bg-ink px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-3">
            Voir tous les résultats dans le catalogue <ArrowRightIcon size={16} weight="bold" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
