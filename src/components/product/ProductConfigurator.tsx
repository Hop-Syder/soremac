/**
 * Bloc d'achat de la fiche produit (TDR §26–28) :
 * variantes (présélection depuis la recherche, ex. ?diametre=12), quantité,
 * « Ajouter au devis », WhatsApp contextualisé, barre d'action collante sur mobile.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { AddToQuoteButton } from "./AddToQuote";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useQuote } from "@/components/quote/QuoteProvider";
import { whatsappProduct } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function ProductConfigurator({ product }: { product: Product }) {
  const params = useSearchParams();
  const { add, count, setOpen } = useQuote();
  const [sel, setSel] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaVisible = useInView(ctaRef, { margin: "0px 0px -40px 0px" });

  useEffect(() => {
    track("product_view", { product: product.slug });
    const pre: Record<string, string> = {};
    for (const axis of product.variants) {
      const v = params.get(axis.key);
      if (v && axis.options.includes(v)) pre[axis.key] = v;
      else if (axis.options.length === 1) pre[axis.key] = axis.options[0];
    }
    setSel(pre);
  }, [params, product]);

  const complete = product.variants.every((a) => sel[a.key]);
  // Libellés lisibles pour le devis : { "Diamètre": "12 mm" }
  const labelled = useMemo(
    () => Object.fromEntries(product.variants.filter((a) => sel[a.key]).map((a) => [a.label, `${sel[a.key]}${a.unit ? ` ${a.unit}` : ""}`])),
    [sel, product.variants],
  );
  const variantText = Object.values(labelled).join(" · ");
  const waHref = whatsappProduct(product.name, variantText || undefined);

  return (
    <div className="grid gap-6">
      {product.variants.map((axis) => (
        <fieldset key={axis.key}>
          <legend className="mb-2.5 flex w-full items-baseline justify-between text-[13px] font-semibold">
            {axis.label}
            <span className="font-normal text-steel">{sel[axis.key] ? `${sel[axis.key]}${axis.unit ? ` ${axis.unit}` : ""}` : "À choisir"}</span>
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={axis.label}>
            {axis.options.map((o) => {
              const active = sel[axis.key] === o;
              return (
                <button
                  key={o}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSel((s) => ({ ...s, [axis.key]: o }))}
                  className={cn(
                    "tabular relative h-11 min-w-14 border px-3.5 text-sm font-medium transition-colors",
                    active ? "border-ink text-paper" : "border-line bg-white text-ink hover:border-ink/50",
                  )}
                >
                  {active && <motion.span layoutId={`variant-${axis.key}`} className="absolute inset-0 bg-ink" transition={{ duration: 0.3, ease: EASE }} />}
                  <span className="relative">{o}{axis.unit && axis.key !== "grade" ? <span className="text-[11px] opacity-70"> {axis.unit}</span> : null}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <p className="mb-2.5 text-[13px] font-semibold">Quantité <span className="font-normal text-steel">({product.unit})</span></p>
        <div className="inline-flex items-center border border-line bg-white">
          <button className="grid size-12 place-items-center text-steel hover:text-ink" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer"><Minus size={16} /></button>
          <input
            type="number"
            min={1}
            value={qty}
            inputMode="numeric"
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="tabular h-12 w-20 border-x border-line text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Quantité"
          />
          <button className="grid size-12 place-items-center text-steel hover:text-ink" onClick={() => setQty((q) => q + 1)} aria-label="Augmenter"><Plus size={16} /></button>
        </div>
      </div>

      <div className="flex items-end justify-between border-y border-line py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Prix</p>
          <p className="font-display text-2xl font-bold uppercase">Prix sur demande</p>
        </div>
        <p className="text-right text-sm text-steel">Vérifier la disponibilité<br />auprès de notre équipe</p>
      </div>

      <div ref={ctaRef} className="grid gap-2.5">
        <AddToQuoteButton product={product} variant={labelled} quantity={qty} disabled={!complete} />
        {!complete && <p className="-mt-1 text-xs text-steel">Sélectionnez {product.variants.filter((a) => !sel[a.key]).map((a) => a.label.toLowerCase()).join(" et ")} pour ajouter au devis.</p>}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "product", product: product.slug })}
          className="inline-flex h-14 items-center justify-center gap-2.5 border border-ink/20 text-[15px] font-semibold transition-colors hover:border-ink"
        >
          <WhatsAppIcon className="text-whatsapp" /> Demander sur WhatsApp
        </a>
      </div>

      {product.authenticity && (
        <p className="flex items-start gap-3 bg-ink p-4 text-sm text-paper">
          <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={18} /> {product.authenticity}
        </p>
      )}

      {/* Barre collante mobile — apparaît quand les CTA principaux sortent de l'écran */}
      <AnimatePresence>
        {!ctaVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[45] flex items-center gap-2 border-t border-line bg-paper/95 px-4 pt-3 backdrop-blur-md pb-safe lg:hidden"
          >
            <button onClick={() => setOpen(true)} className="tabular relative grid size-12 shrink-0 place-items-center border border-line text-sm font-bold" aria-label="Voir ma sélection">
              {count}
            </button>
            <button
              disabled={!complete}
              onClick={() => add({ slug: product.slug, category: product.category, name: product.name, image: product.gallery[0].src, unit: product.unit, variant: labelled }, qty)}
              className="h-12 flex-1 bg-accent text-sm font-semibold text-ink disabled:opacity-50"
            >
              {complete ? `Ajouter au devis${variantText ? ` · ${variantText}` : ""}` : "Choisir une variante"}
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="grid size-12 shrink-0 place-items-center bg-whatsapp text-white" aria-label="WhatsApp">
              <WhatsAppIcon size={20} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
