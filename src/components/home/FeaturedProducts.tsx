/**
 * 05 — « Les produits recherchés. » (TDR §12) — onglets par famille + carrousel Embla.
 * Desktop : flèches et glisser. Mobile : swipe natif, cartes à 82 % de largeur (aperçu de la suivante).
 * Motion : changement d'onglet en fondu/glissé, indicateur d'onglet partagé (layoutId).
 * @hopsyder
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const tabs = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => p.categoryName && !seen.has(p.category) && seen.set(p.category, p.categoryName));
    return [{ key: "all", label: "Tous" }, ...[...seen].map(([key, label]) => ({ key, label }))];
  }, [products]);
  const [tab, setTab] = useState("all");
  const list = tab === "all" ? products : products.filter((p) => p.category === tab);

  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: false });
  const [canPrev, setPrev] = useState(false);
  const [canNext, setNext] = useState(false);
  const sync = useCallback(() => {
    if (!api) return;
    setPrev(api.canScrollPrev());
    setNext(api.canScrollNext());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync);
  }, [api, sync]);
  useEffect(() => { api?.scrollTo(0, true); }, [tab, api]);

  const arrow = "grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filtrer par famille" className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors", tab === t.key ? "text-white" : "text-steel hover:text-ink")}
            >
              {tab === t.key && <motion.span layoutId="featured-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.35, ease: EASE }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button className={arrow} onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label="Produits précédents"><CaretLeftIcon size={18} weight="bold" /></button>
          <button className={arrow} onClick={() => api?.scrollNext()} disabled={!canNext} aria-label="Produits suivants"><CaretRightIcon size={18} weight="bold" /></button>
        </div>
      </div>

      <div ref={ref} className="-mx-5 overflow-hidden px-5 sm:mx-0 sm:px-0">
        <ul className="-ml-4 flex touch-pan-y py-3">
          {list.map((p, i) => (
            <motion.li
              key={`${tab}-${p.slug}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 4) * 0.06 }}
              className="flex min-w-0 shrink-0 grow-0 basis-[82%] pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <ProductCard product={p} className="w-full" />
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
