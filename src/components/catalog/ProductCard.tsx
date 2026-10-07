/**
 * Product Card (TDR §23) — Motion C : légère montée, zoom image ≤ 1.04, CTA plus visible.
 * Aucune rotation 3D. Le prix n'est jamais inventé : « Prix sur demande ».
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { productUrl } from "@/lib/catalog/products";
import { AddToQuoteQuick } from "@/components/product/AddToQuote";
import { cn } from "@/lib/cn";

export function ProductCard({ product, query = "", priority, className }: { product: Product; query?: string; priority?: boolean; className?: string }) {
  const href = productUrl(product) + query;
  const axis = product.variants.find((v) => v.options.length > 1) ?? product.variants[0];

  return (
    <article className={cn("group relative flex flex-col bg-white transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(18,19,20,0.45)]", className)}>
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-paper-2" tabIndex={-1} aria-hidden>
        <Image
          src={product.gallery[0].src}
          alt=""
          fill
          priority={priority}
          sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-accent px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">{product.badge}</span>
        )}
        {product.gallery.length > 1 && (
          <span className="tabular absolute bottom-3 right-3 bg-ink/70 px-1.5 py-0.5 text-[10.5px] text-paper backdrop-blur">{product.gallery.length} vues</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">
          {product.categoryName}{product.brand ? ` · ${product.brand}` : ""}
        </p>
        <h3 className="mt-1.5 font-display text-[22px] font-bold uppercase leading-none">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-steel">{product.summary}</p>
        {axis && (
          <ul className="mt-3 flex flex-wrap gap-1" aria-label={axis.label}>
            {axis.options.slice(0, 6).map((o) => (
              <li key={o} className="tabular border border-line px-1.5 py-0.5 text-[11.5px] text-ink/80">
                {o}{axis.unit ? ` ${axis.unit}` : ""}
              </li>
            ))}
            {axis.options.length > 6 && <li className="px-1 py-0.5 text-[11.5px] text-steel">+{axis.options.length - 6}</li>}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-[13px] font-medium text-steel">Prix sur demande</span>
          <span className="relative z-10 flex items-center gap-1">
            <AddToQuoteQuick product={product} />
            <span className="grid size-10 place-items-center bg-paper-2 text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper" aria-hidden>
              <ArrowUpRight size={18} />
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
