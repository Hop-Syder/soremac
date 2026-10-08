/**
 * 04 — « Tout pour votre chantier. » (TDR §11) — mosaïque éditoriale asymétrique,
 * 11 familles + tuile « tout le catalogue ». Grille 4 colonnes calculée pour se remplir sans trou.
 * Hover : image +4 %, texte qui glisse, flèche qui apparaît, voile discret.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, SquaresFourIcon } from "@phosphor-icons/react/ssr";
import type { Category } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

export function CategoryBento({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  // 1 tuile 2×2, 1 tuile 2×1, le reste 1×1 : 4 + 2 + n + 1 (tuile catalogue) = multiple de 4 pour 11 familles
  const span = (i: number) => (i === 0 ? "col-span-2 row-span-2" : i === 1 ? "col-span-2" : "col-span-1");

  return (
    <ul className="grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[210px] lg:grid-cols-4 lg:gap-4">
      {categories.map((c, i) => (
        <li key={c.slug} data-m="wipe" className={span(i)}>
          <Link href={`/produits/${c.slug}`} className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[20px] bg-ink p-4 text-white md:p-6">
            {c.image && (
              <div data-m="parallax" className="absolute -inset-y-[8%] inset-x-0"><Image
                src={c.image}
                alt=""
                fill
                sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/0 transition-opacity duration-500 group-hover:opacity-90" />
            <span className="absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:right-4 md:top-4">
              <ArrowUpRightIcon size={16} weight="bold" />
            </span>
            <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1">
              {counts[c.slug] ? (
                <span className="mb-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11.5px] font-medium backdrop-blur">
                  {counts[c.slug]} produit{counts[c.slug] > 1 ? "s" : ""}
                </span>
              ) : null}
              <h3 className={cn("font-display font-semibold leading-tight tracking-[-0.025em]", i === 0 ? "text-3xl md:text-5xl" : i === 1 ? "text-2xl md:text-3xl" : "text-lg md:text-[22px]")}>{c.name}</h3>
              {i < 2 && <p className="mt-2 hidden max-w-md text-sm text-white/75 sm:block">{c.description}</p>}
            </div>
          </Link>
        </li>
      ))}
      <li className="col-span-1">
        <Link href="/produits" className="group flex h-full flex-col justify-between rounded-[20px] border border-dashed border-ink/20 bg-white p-4 transition-colors hover:border-ink hover:bg-ink hover:text-white md:p-6">
          <SquaresFourIcon size={28} weight="duotone" className="text-accent" />
          <span>
            <span className="block font-display text-lg font-semibold tracking-tight md:text-[22px]">Tout le catalogue</span>
            <span className="mt-1 inline-flex items-center gap-1 text-sm text-steel group-hover:text-white/70">Explorer <ArrowUpRightIcon size={14} /></span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
