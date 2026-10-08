/**
 * 10 — « Des produits sélectionnés pour vos travaux. » (TDR §16) — vitrine éditoriale :
 * bandeau défilant des marques/gammes + 3 produits mis en scène (grand format + deux formats moyens).
 * Motion : reveal horizontal ; bandeau en défilement CSS continu (pause au survol, coupé si reduced-motion).
 * @hopsyder
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { productUrl } from "@/lib/catalog/products";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const NAMES = ["SIKA", "TOITUROL", "CIMBENIN", "Tôles", "Fers à béton", "Sanitaires", "Carrelages", "Bétonnières"];

export function BrandShowcase({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
        {products.map((p, i) => (
          <Reveal key={p.slug} dir="left" delay={i * 0.08} className={i === 0 ? "lg:row-span-2" : ""}>
            <Link
              href={productUrl(p)}
              className={cn("group relative flex h-full flex-col justify-end overflow-hidden rounded-[24px] bg-ink p-6 text-white md:p-9", i === 0 ? "min-h-[440px] lg:min-h-[620px]" : "min-h-[300px]")}
            >
              {p.gallery[0] && <div data-m="parallax" className="absolute -inset-y-[8%] inset-x-0"><Image src={p.gallery[0].src} alt={p.gallery[0].alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:rotate-45"><ArrowUpRightIcon size={18} weight="bold" /></span>
              <div className="relative max-w-md">
                {p.brand && <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">{p.brand}</span>}
                <h3 className={cn("mt-4 font-display font-bold leading-none tracking-[-0.04em]", i === 0 ? "text-5xl md:text-7xl" : "text-4xl")}>{p.name}</h3>
                <p className="mt-3 text-white/75">{p.summary}</p>
                {p.variants[0] && (
                  <p className="tabular mt-4 text-sm text-white/60">{p.variants[0].label} : {p.variants[0].options.join(" · ")}{p.variants[0].unit ? ` ${p.variants[0].unit}` : ""}</p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="relative mt-10 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div data-m="velocity" className="flex w-max gap-14 pr-14">
          {[...NAMES, ...NAMES].map((n, i) => (
            <span key={i} className="font-display text-3xl font-bold tracking-[-0.03em] text-ink/25 md:text-4xl" aria-hidden={i >= NAMES.length}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
