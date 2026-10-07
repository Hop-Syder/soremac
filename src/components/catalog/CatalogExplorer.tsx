/**
 * Explorateur catalogue (TDR §21–22, §56) — recherche instantanée, filtres, tri, chargement progressif.
 * Desktop : panneau de filtres collant à gauche. Mobile : bouton « Filtrer » → bottom-sheet.
 * État (q, categorie, type, marque, tri) synchronisé dans l'URL : partageable et indexable.
 * Un filtre n'apparaît que si des données réelles l'alimentent.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, FunnelSimpleIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr";
import type { Category, Product } from "@/lib/catalog/types";
import { normalize, preselectQuery, searchProducts } from "@/lib/catalog/search";
import { ProductCard } from "./ProductCard";
import { Drawer } from "@/components/ui/Drawer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

const PAGE = 12;
const EXAMPLES = ["Fer 12", "Sikalatex 20 litres", "Tôle couleur", "Lavabo", "Bétonnière"];
type Key = "categorie" | "type" | "marque";
type Sort = "pertinence" | "populaires" | "az";
interface Facet { key: Key; label: string; options: { value: string; label: string; count: number }[] }

export function CatalogExplorer({ products, categories, lockedCategory }: { products: Product[]; categories: Category[]; lockedCategory?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [filters, setFilters] = useState<Record<Key, string[]>>({ categorie: params.getAll("categorie"), type: params.getAll("type"), marque: params.getAll("marque") });
  const [sort, setSort] = useState<Sort>((params.get("tri") as Sort) || "pertinence");
  const [limit, setLimit] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  useEffect(() => { if (params.get("recherche")) inputRef.current?.focus(); }, [params]);

  // URL ← état (sans scroll, sans entrée d'historique)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    (Object.keys(filters) as Key[]).forEach((k) => filters[k].forEach((v) => sp.append(k, v)));
    if (sort !== "pertinence") sp.set("tri", sort);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setLimit(PAGE);
  }, [q, filters, sort, pathname, router]);

  const hits = useMemo(() => searchProducts(products, q), [products, q]);
  const filtered = useMemo(() => {
    const list = hits.filter(({ product: p }) =>
      (!filters.categorie.length || filters.categorie.includes(p.category)) &&
      (!filters.type.length || (p.subcategory && filters.type.includes(p.subcategory))) &&
      (!filters.marque.length || (p.brand && filters.marque.includes(p.brand))),
    );
    if (sort === "az") return [...list].sort((a, b) => a.product.name.localeCompare(b.product.name, "fr"));
    if (sort === "populaires") return [...list].sort((a, b) => Number(!!b.product.popular) - Number(!!a.product.popular) || Number(!!b.product.featured) - Number(!!a.product.featured));
    return list;
  }, [hits, filters, sort]);

  // KPI : recherches et requêtes sans résultat (TDR §60)
  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => track(filtered.length ? "search" : "search_no_result", { q: normalize(q), results: filtered.length }), 800);
    return () => clearTimeout(t);
  }, [q, filtered.length]);

  const facets: Facet[] = useMemo(() => {
    const base = hits.map((h) => h.product);
    const count = (fn: (p: Product) => string | undefined) => {
      const m = new Map<string, number>();
      base.forEach((p) => { const v = fn(p); if (v) m.set(v, (m.get(v) ?? 0) + 1); });
      return m;
    };
    const cats = count((p) => p.category), types = count((p) => p.subcategory), brands = count((p) => p.brand);
    const list: Facet[] = [];
    if (!lockedCategory) list.push({ key: "categorie", label: "Catégorie", options: categories.filter((c) => cats.has(c.slug)).map((c) => ({ value: c.slug, label: c.name, count: cats.get(c.slug)! })) });
    list.push({ key: "type", label: "Type", options: [...types].map(([v, n]) => ({ value: v, label: v, count: n })).sort((a, b) => a.label.localeCompare(b.label, "fr")) });
    list.push({ key: "marque", label: "Marque", options: [...brands].map(([v, n]) => ({ value: v, label: v, count: n })) });
    return list.filter((f) => f.options.length > 0);
  }, [hits, lockedCategory, categories]);

  const toggle = (k: Key, v: string) => setFilters((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const reset = () => setFilters({ categorie: [], type: [], marque: [] });
  const activeChips = (Object.keys(filters) as Key[]).flatMap((k) => filters[k].map((v) => ({ k, v, label: k === "categorie" ? categories.find((c) => c.slug === v)?.name ?? v : v })));

  const panel = (
    <div className="grid gap-7">
      {facets.map((f) => (
        <fieldset key={f.key}>
          <legend className="mb-3 text-sm font-semibold">{f.label}</legend>
          <ul className="grid gap-0.5">
            {f.options.map((o) => {
              const on = filters[f.key].includes(o.value);
              return (
                <li key={o.value}>
                  <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-[14.5px] transition-colors hover:bg-paper", on && "font-medium")}>
                    <input type="checkbox" checked={on} onChange={() => toggle(f.key, o.value)} className="peer sr-only" />
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent", on ? "border-ink bg-ink text-white" : "border-line bg-white")}>
                      {on && <CheckIcon size={12} weight="bold" />}
                    </span>
                    <span className="flex-1">{o.label}</span>
                    <span className="tabular rounded-full bg-paper px-2 text-xs text-steel">{o.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  );

  return (
    <div>
      {/* Barre d'outils */}
      <div className="sticky top-[64px] z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un produit</span>
            <MagnifyingGlassIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une marque, une dimension..."
              className="h-13 w-full rounded-[12px] border border-line bg-white pl-12 pr-11 text-[16px] shadow-[var(--shadow-card)] outline-none transition-colors placeholder:text-steel-2 focus:border-ink/40 lg:h-14"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-steel hover:bg-paper hover:text-ink" aria-label="Effacer la recherche">
                <XIcon size={16} weight="bold" />
              </button>
            )}
          </label>
          <button onClick={() => setSheet(true)} className="relative flex h-13 items-center gap-2 rounded-[12px] border border-line bg-white px-4 text-sm font-semibold lg:hidden">
            <FunnelSimpleIcon size={18} weight="bold" /> Filtrer
            {activeChips.length > 0 && <span className="tabular grid size-5 place-items-center rounded-full bg-accent text-[11px] text-ink">{activeChips.length}</span>}
          </button>
        </div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-xs text-steel-2">Exemples :</span>
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => setQ(e)} className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium transition-colors hover:border-ink/40">{e}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="sticky top-24 rounded-[18px] border border-line bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold tracking-tight">Filtres</p>
              {activeChips.length > 0 && <button onClick={reset} className="text-sm text-steel underline-offset-4 hover:text-ink hover:underline">Effacer</button>}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-live="polite" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-steel">
              <span className="tabular font-semibold text-ink">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""}
              {q && <> pour « <span className="font-medium text-ink">{q}</span> »</>}
            </p>
            <label className="flex items-center gap-2 text-sm text-steel">
              Trier
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-[10px] border border-line bg-white px-3 text-sm font-medium text-ink outline-none focus:border-ink/40">
                <option value="pertinence">Pertinence</option>
                <option value="populaires">Les plus demandés</option>
                <option value="az">Nom (A → Z)</option>
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeChips.map((c) => (
                <button key={c.k + c.v} onClick={() => toggle(c.k, c.v)} className="inline-flex items-center gap-1.5 rounded-full bg-ink py-1.5 pl-3 pr-2 text-sm text-white">
                  {c.label} <XIcon size={13} weight="bold" />
                </button>
              ))}
              <button onClick={reset} className="px-2 text-sm text-steel underline-offset-4 hover:underline">Tout effacer</button>
            </div>
          )}

          {filtered.length ? (
            <>
              <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.slice(0, limit).map(({ product, preselect }, i) => (
                    <motion.li
                      key={product.slug}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.045 } }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                      className="flex"
                    >
                      <ProductCard product={product} query={preselectQuery(preselect)} priority={i < 3} className="w-full" />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
              {filtered.length > limit && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-sm text-steel">{limit} sur {filtered.length} produits</p>
                  <Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>Afficher plus de produits</Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[20px] border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-paper text-steel"><MagnifyingGlassIcon size={26} /></span>
              <p className="t-h3 mt-5">Aucun produit ne correspond à votre recherche.</p>
              <p className="mx-auto mt-2 max-w-md text-steel">Essayez une autre référence ou contactez notre équipe.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <ButtonLink href={whatsappGeneral()} variant="whatsapp"><WhatsAppIcon size={18} /> Demander de l'aide</ButtonLink>
                {activeChips.length > 0 && <Button variant="outline" onClick={reset}>Retirer les filtres</Button>}
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
        footer={
          <div className="flex gap-2">
            {activeChips.length > 0 && <Button variant="outline" size="lg" onClick={reset}>Effacer</Button>}
            <Button variant="dark" size="lg" className="flex-1" onClick={() => setSheet(false)}>Voir {filtered.length} produit{filtered.length > 1 ? "s" : ""}</Button>
          </div>
        }
      >
        <div className="px-5 py-5">{panel}</div>
      </Drawer>
    </div>
  );
}
