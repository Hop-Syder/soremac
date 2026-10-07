/**
 * Palette de recherche instantanée (TDR §21, Objectif 2).
 * Résultats au fil de la frappe, variantes déduites (« Fer 12 » → Ø 12 mm),
 * navigation clavier ↑ ↓ Entrée, renvoi vers le catalogue complet.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, MagnifyingGlassIcon, ArrowElbowDownLeftIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { preselectQuery, searchProducts } from "@/lib/catalog/search";
import { productUrl } from "@/lib/catalog/products";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const SUGGESTIONS = ["Fer 12", "Sikalatex 20 litres", "Ciment", "Tôle", "Carrelage", "Bétonnière"];

export function QuickSearch({ products, open, onOpenChange }: { products: Product[]; open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const hits = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 6) : []), [products, q]);
  useEffect(() => setActive(0), [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };
  const submit = () => {
    if (hits[active]) go(productUrl(hits[active].product) + preselectQuery(hits[active].preselect));
    else if (q.trim()) go(`/produits?q=${encodeURIComponent(q)}`);
    if (q.trim()) track(hits.length ? "search" : "search_no_result", { q, from: "palette" });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-3 top-[8vh] z-[81] mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-lift)] outline-none sm:top-[12vh]"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <Dialog.Title className="sr-only">Rechercher un produit</Dialog.Title>
                <Dialog.Description className="sr-only">Tapez un produit, une marque ou une dimension.</Dialog.Description>
                <div className="flex items-center gap-3 border-b border-line px-5">
                  <MagnifyingGlassIcon size={22} className="shrink-0 text-steel" />
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
                      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                      if (e.key === "Enter") { e.preventDefault(); submit(); }
                    }}
                    placeholder="Rechercher un produit, une marque, une dimension..."
                    className="h-16 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-steel-2"
                    aria-label="Rechercher"
                  />
                  <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[11px] text-steel sm:block">Échap</kbd>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {!q.trim() && (
                    <div className="p-3">
                      <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-steel-2">Recherches fréquentes</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                          <button key={s} onClick={() => setQ(s)} className="rounded-full border border-line px-3.5 py-1.5 text-sm transition-colors hover:border-ink hover:bg-paper">{s}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.trim() && hits.length > 0 && (
                    <ul role="listbox" aria-label="Résultats">
                      {hits.map(({ product, preselect }, i) => {
                        const variant = Object.values(preselect);
                        return (
                          <li key={product.slug} role="option" aria-selected={i === active}>
                            <button
                              onMouseEnter={() => setActive(i)}
                              onClick={() => go(productUrl(product) + preselectQuery(preselect))}
                              className={cn("flex w-full items-center gap-4 rounded-xl p-2.5 text-left transition-colors", i === active && "bg-paper")}
                            >
                              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                                <Image src={product.gallery[0]?.src ?? ""} alt="" fill sizes="56px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold">{product.name}</span>
                                <span className="block truncate text-sm text-steel">
                                  {product.categoryName}{product.brand ? ` · ${product.brand}` : ""}
                                </span>
                              </span>
                              {variant.length > 0 && (
                                <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-2">{variant.join(" · ")}</span>
                              )}
                              {i === active && <ArrowElbowDownLeftIcon size={16} className="shrink-0 text-steel" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {q.trim() && hits.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <p className="font-semibold">Aucun produit ne correspond à votre recherche.</p>
                      <p className="mt-1 text-sm text-steel">Essayez une autre référence ou contactez notre équipe.</p>
                    </div>
                  )}
                </div>

                {q.trim() && (
                  <button onClick={() => go(`/produits?q=${encodeURIComponent(q)}`)} className="flex w-full items-center justify-between border-t border-line px-5 py-3.5 text-sm font-medium hover:bg-paper">
                    Voir tous les résultats pour « {q} » <ArrowRightIcon size={16} />
                  </button>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
