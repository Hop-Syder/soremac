/**
 * Product Card (TDR §23) — Motion C : légère montée, zoom image ≤ 1.04, CTA révélé.
 * Photo encadrée (style e-commerce premium), badge, catégorie, nom, variantes, prix sur demande.
 * Jamais de faux prix ni de rotation 3D.
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, ImagesIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { productUrl } from "@/lib/catalog/products";
import { AddToQuoteQuick } from "@/components/product/AddToQuote";
import { cn } from "@/lib/cn";

export function ProductCard({ product, query = "", priority, className }: { product: Product; query?: string; priority?: boolean; className?: string }) {
  const href = productUrl(product) + query;
  // Axe le plus riche (ex. diamètres plutôt que grades) : le plus parlant sur une carte
  const axis = [...product.variants].sort((a, b) => b.options.length - a.options.length)[0];
  const shown = axis?.options.slice(0, 5) ?? [];

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-ink/15 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-paper-2">
        {product.gallery[0] && (
          <Image
            src={product.gallery[0].src}
            alt={product.gallery[0].alt}
            fill
            priority={priority}
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {product.badge ? <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-semibold text-ink shadow-sm backdrop-blur">{product.badge}</span> : <span />}
          {product.gallery.length > 1 && (
            <span className="tabular inline-flex items-center gap-1 rounded-full bg-ink/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
              <ImagesIcon size={13} /> {product.gallery.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="text-[12.5px] font-medium text-steel">
          {product.categoryName}{product.brand ? <> · <span className="text-ink">{product.brand}</span></> : null}
        </p>
        <h3 className="mt-1 font-display text-[19px] font-semibold leading-snug tracking-[-0.02em]">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']">{product.name}</Link>
        </h3>

        {axis && (
          <div className="mt-3">
            <p className="text-[11.5px] text-steel-2">{axis.label}{axis.options.length > 1 ? ` · ${axis.options.length} choix` : ""}</p>
            <ul className="mt-1.5 flex flex-wrap gap-1" aria-label={axis.label}>
              {shown.map((o) => (
                <li key={o} className="tabular rounded-md bg-paper px-2 py-0.5 text-[12px] font-medium text-ink/80">
                  {o}{axis.unit ? ` ${axis.unit}` : ""}
                </li>
              ))}
              {axis.options.length > shown.length && <li className="px-1 py-0.5 text-[12px] text-steel">+{axis.options.length - shown.length}</li>}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-[13.5px] text-steel">Prix sur demande</span>
          <span className="relative z-10 flex items-center gap-1.5">
            <AddToQuoteQuick product={product} />
            <span className="grid size-9 place-items-center rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-white" aria-hidden>
              <ArrowUpRightIcon size={16} weight="bold" />
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
