/**
 * Bloc d'achat de la fiche produit (TDR §26–28, §57).
 * Variantes (présélection depuis la recherche : ?diametre=12), quantité, prix sur demande,
 * « Ajouter au devis », WhatsApp contextualisé (variante incluse), barre d'action collante mobile.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ClipboardTextIcon, MinusIcon, PlusIcon, SealCheckIcon, TruckIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { AddToQuoteButton } from "./AddToQuote";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/Button";
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
  const missing = product.variants.filter((a) => !sel[a.key]).map((a) => a.label.toLowerCase());
  const labelled = useMemo(
    () => Object.fromEntries(product.variants.filter((a) => sel[a.key]).map((a) => [a.label, `${sel[a.key]}${a.unit ? ` ${a.unit}` : ""}`])),
    [sel, product.variants],
  );
  const variantText = Object.values(labelled).join(" · ");
  const waHref = whatsappProduct(product.name, variantText || undefined);

  return (
    <div className="grid gap-7">
      {product.variants.map((axis) => (
        <fieldset key={axis.key}>
          <legend className="mb-3 flex w-full items-baseline justify-between text-[15px] font-semibold">
            {axis.label}
            <span className={cn("text-sm font-medium", sel[axis.key] ? "text-ink" : "text-accent-2")}>
              {sel[axis.key] ? `${sel[axis.key]}${axis.unit ? ` ${axis.unit}` : ""}` : "À choisir"}
            </span>
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
                    "tabular relative h-11 min-w-[3.5rem] rounded-[10px] border px-4 text-[15px] font-medium transition-colors",
                    active ? "border-ink text-white" : "border-line bg-white text-ink hover:border-ink/40",
                  )}
                >
                  {active && <motion.span layoutId={`variant-${axis.key}`} className="absolute inset-0 rounded-[9px] bg-ink" transition={{ duration: 0.3, ease: EASE }} />}
                  <span className="relative">{o}{axis.unit ? <span className="text-[12px] opacity-60"> {axis.unit}</span> : null}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="mb-3 text-[15px] font-semibold">Quantité <span className="font-normal text-steel">· {product.unit}</span></p>
          <div className="inline-flex items-center rounded-[12px] border border-line bg-white">
            <button className="grid size-12 place-items-center text-steel hover:text-ink" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité"><MinusIcon size={16} weight="bold" /></button>
            <input
              type="number"
              min={1}
              value={qty}
              inputMode="numeric"
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="tabular h-12 w-16 text-center text-[16px] font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantité"
            />
            <button className="grid size-12 place-items-center text-steel hover:text-ink" onClick={() => setQty((q) => q + 1)} aria-label="Augmenter la quantité"><PlusIcon size={16} weight="bold" /></button>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-steel">Prix</p>
          <p className="font-display text-2xl font-semibold tracking-tight">Prix sur demande</p>
        </div>
      </div>

      <div ref={ctaRef} className="grid gap-2.5">
        <AddToQuoteButton product={product} variant={labelled} quantity={qty} disabled={!complete} />
        {!complete && <p className="text-center text-sm text-steel">Sélectionnez {missing.join(" et ")} pour ajouter au devis.</p>}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "product", product: product.slug })}
          className={buttonClass("outline", "lg", "w-full text-ink")}
        >
          <WhatsAppIcon size={20} className="text-whatsapp" /> Demander sur WhatsApp
        </a>
      </div>

      <ul className="grid gap-3 rounded-[16px] bg-paper p-4 text-sm">
        <li className="flex items-center gap-3"><ClipboardTextIcon size={20} weight="duotone" className="shrink-0 text-accent-2" /> Disponibilité vérifiée par notre équipe lors du devis</li>
        <li className="flex items-center gap-3"><TruckIcon size={20} weight="duotone" className="shrink-0 text-accent-2" /> Livraison à Cotonou et environs</li>
        {product.authenticity && <li className="flex items-center gap-3 font-medium"><SealCheckIcon size={20} weight="fill" className="shrink-0 text-accent" /> {product.authenticity}</li>}
      </ul>

      {/* Barre d'action collante mobile */}
      <AnimatePresence>
        {!ctaVisible && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-[45] flex items-center gap-2 rounded-2xl border border-line bg-white/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl lg:hidden"
          >
            <button onClick={() => setOpen(true)} className="tabular relative grid size-12 shrink-0 place-items-center rounded-xl bg-paper text-sm font-bold" aria-label={`Voir ma sélection (${count})`}>
              <ClipboardTextIcon size={20} />
              {count > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] text-ink">{count}</span>}
            </button>
            <button
              disabled={!complete}
              onClick={() => add({ slug: product.slug, category: product.category, name: product.name, image: product.gallery[0]?.src ?? "", unit: product.unit, variant: labelled }, qty)}
              className="h-12 min-w-0 flex-1 truncate rounded-xl bg-accent px-3 text-[15px] font-semibold text-ink disabled:opacity-50"
            >
              {complete ? `Ajouter au devis${variantText ? ` · ${variantText}` : ""}` : `Choisir ${missing[0] ?? "une variante"}`}
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="grid size-12 shrink-0 place-items-center rounded-xl bg-whatsapp text-white" aria-label="Demander sur WhatsApp">
              <WhatsAppIcon size={22} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
