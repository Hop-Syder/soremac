/**
 * Explorateur catalogue (TDR §21–22, §56) — recherche instantanée, filtres, chargement progressif.
 * Desktop : sidebar de filtres. Mobile : bouton « Filtrer » → bottom-sheet.
 * L'état (q, categorie, marque) est synchronisé dans l'URL : partageable et indexable.
 * Un filtre n'est affiché que si des données réelles l'alimentent.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Product } from "@/lib/catalog/types";
import { searchProducts, preselectQuery } from "@/lib/catalog/search";
import { ProductCard } from "./ProductCard";
import { Drawer } from "@/components/ui/Drawer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

const PAGE = 12;
const EXAMPLES = ["Fer 12", "Sikalatex 20 litres", "Tôle couleur", "Lavabo", "Bétonnière"];

interface Facet { key: "categorie" | "marque" | "type"; label: string; options: { value: string; label: string; count: number }[] }

export function CatalogExplorer({ products, categories, lockedCategory }: { products: Product[]; categories: Category[]; lockedCategory?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [filters, setFilters] = useState<Record<Facet["key"], string[]>>({
    categorie: params.getAll("categorie"),
    marque: params.getAll("marque"),
    type: params.getAll("type"),
  });
  const [limit, setLimit] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  // Accès direct « Recherche » depuis le dock mobile
  useEffect(() => {
    if (params.get("recherche")) inputRef.current?.focus();
  }, [params]);

  // Synchronise l'URL (sans scroll ni nouvelle entrée d'historique)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    (Object.keys(filters) as Facet["key"][]).forEach((k) => filters[k].forEach((v) => sp.append(k, v)));
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setLimit(PAGE);
  }, [q, filters, pathname, router]);

  const hits = useMemo(() => searchProducts(products, q), [products, q]);
  const filtered = useMemo(
    () =>
      hits.filter(({ product: p }) =>
        (!filters.categorie.length || filters.categorie.includes(p.category)) &&
        (!filters.marque.length || (p.brand && filters.marque.includes(p.brand))) &&
        (!filters.type.length || (p.subcategory && filters.type.includes(p.subcategory))),
      ),
    [hits, filters],
  );

  // KPI : recherches et requêtes sans résultat (TDR §60)
  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => track(filtered.length ? "search" : "search_no_result", { q, results: filtered.length }), 800);
    return () => clearTimeout(t);
  }, [q, filtered.length]);

  const facets: Facet[] = useMemo(() => {
    const base = hits.map((h) => h.product);
    const count = (fn: (p: Product) => string | undefined) => {
      const m = new Map<string, number>();
      base.forEach((p) => { const v = fn(p); if (v) m.set(v, (m.get(v) ?? 0) + 1); });
      return m;
    };
    const cats = count((p) => p.category);
    const brands = count((p) => p.brand);
    const types = count((p) => p.subcategory);
    const list: Facet[] = [];
    if (!lockedCategory)
      list.push({ key: "categorie", label: "Catégorie", options: categories.filter((c) => cats.has(c.slug)).map((c) => ({ value: c.slug, label: c.name, count: cats.get(c.slug)! })) });
    list.push({ key: "type", label: "Type", options: [...types].map(([v, n]) => ({ value: v, label: v, count: n })).sort((a, b) => a.label.localeCompare(b.label)) });
    list.push({ key: "marque", label: "Marque", options: [...brands].map(([v, n]) => ({ value: v, label: v, count: n })) });
    return list.filter((f) => f.options.length > 0);
  }, [hits, lockedCategory, categories]);

  const toggle = (k: Facet["key"], v: string) =>
    setFilters((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const active = Object.values(filters).flat().length;
  const reset = () => setFilters({ categorie: [], marque: [], type: [] });

  const filterPanel = (
    <div className="grid gap-8">
      {facets.map((f) => (
        <fieldset key={f.key}>
          <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">{f.label}</legend>
          <ul className="grid gap-0.5">
            {f.options.map((o) => {
              const on = filters[f.key].includes(o.value);
              return (
                <li key={o.value}>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[14.5px]">
                    <input type="checkbox" checked={on} onChange={() => toggle(f.key, o.value)} className="peer sr-only" />
                    <span className={cn("grid size-[18px] place-items-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent", on ? "border-ink bg-ink" : "border-line bg-white")}>
                      {on && <span className="size-2 bg-accent" />}
                    </span>
                    <span className="flex-1">{o.label}</span>
                    <span className="tabular text-xs text-steel">{o.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
      {active > 0 && <button onClick={reset} className="justify-self-start text-sm font-medium underline underline-offset-4">Réinitialiser les filtres</button>}
    </div>
  );

  return (
    <div>
      {/* Recherche */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un produit</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" size={20} />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une marque, une dimension..."
              className="h-14 w-full border border-line bg-white pl-12 pr-12 text-[16px] outline-none transition-colors placeholder:text-steel-2 focus:border-ink lg:h-16 lg:text-lg"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-steel hover:text-ink" aria-label="Effacer la recherche">
                <X size={18} />
              </button>
            )}
          </label>
          <button onClick={() => setSheet(true)} className="relative flex h-14 items-center gap-2 border border-line bg-white px-4 text-sm font-semibold lg:hidden">
            <SlidersHorizontal size={18} /> Filtrer
            {active > 0 && <span className="tabular grid size-5 place-items-center rounded-full bg-accent text-[11px] text-ink">{active}</span>}
          </button>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <span className="shrink-0 py-1.5 text-xs text-steel">Exemples :</span>
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => setQ(e)} className="shrink-0 border border-line bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-ink">{e}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtres">{filterPanel}</aside>

        <section aria-live="polite">
          <p className="mb-5 text-sm text-steel">
            <span className="tabular font-semibold text-ink">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""}
            {q && <> pour « <span className="text-ink">{q}</span> »</>}
          </p>

          {filtered.length ? (
            <>
              <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.slice(0, limit).map(({ product, preselect }, i) => (
                    <motion.li
                      key={product.slug}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.05 } }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                      className="flex"
                    >
                      <ProductCard product={product} query={preselectQuery(preselect)} priority={i < 3} className="w-full" />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
              {filtered.length > limit && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>Afficher plus de produits</Button>
                </div>
              )}
            </>
          ) : (
            <div className="border border-dashed border-line bg-white px-6 py-14 text-center">
              <p className="font-display text-2xl font-bold uppercase">Aucun produit ne correspond à votre recherche.</p>
              <p className="mx-auto mt-2 max-w-md text-steel">Essayez une autre référence ou contactez notre équipe.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <ButtonLink href={whatsappGeneral()} variant="whatsapp">Demander de l'aide</ButtonLink>
                {active > 0 && <Button variant="outline" onClick={reset}>Retirer les filtres</Button>}
              </div>
            </div>
          )}
        </section>
      </div>

      <Drawer
        open={sheet}
        onOpenChange={setSheet}
        title="Filtrer"
        side="bottom"
        footer={<Button size="lg" className="w-full" onClick={() => setSheet(false)}>Voir {filtered.length} produit{filtered.length > 1 ? "s" : ""}</Button>}
      >
        <div className="px-5 py-6">{filterPanel}</div>
      </Drawer>
    </div>
  );
}
