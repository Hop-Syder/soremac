/**
 * Liste éditable des lignes de devis (quantités, suppression) avec animations de layout.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuote, variantLabel } from "./QuoteProvider";
import { EASE } from "@/components/motion/tokens";

export function QuoteList() {
  const { items, setQty, remove } = useQuote();
  return (
    <ul className="divide-y divide-line">
      <AnimatePresence initial={false}>
        {items.map((i) => (
          <motion.li
            key={i.key}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 py-4">
              {i.category ? (
                <Link href={`/produits/${i.category}/${i.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-[3px] bg-paper-2">
                  <Image src={i.image} alt="" fill sizes="80px" className="object-cover" />
                </Link>
              ) : (
                <span className="grid size-20 shrink-0 place-items-center rounded-[3px] bg-paper-2 text-[10px] font-semibold uppercase tracking-wider text-steel">Libre</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{i.name}</p>
                {Object.keys(i.variant).length > 0 && <p className="text-sm text-steel">{variantLabel(i.variant)}</p>}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center rounded-[3px] border border-line bg-white">
                    <button className="grid size-9 place-items-center text-steel hover:text-ink" onClick={() => setQty(i.key, i.quantity - 1)} aria-label={`Diminuer la quantité de ${i.name}`}>
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={i.quantity}
                      onChange={(e) => setQty(i.key, Math.max(1, Number(e.target.value) || 1))}
                      className="tabular h-9 w-14 border-x border-line text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label={`Quantité de ${i.name}`}
                    />
                    <button className="grid size-9 place-items-center text-steel hover:text-ink" onClick={() => setQty(i.key, i.quantity + 1)} aria-label={`Augmenter la quantité de ${i.name}`}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-steel">{i.unit}</span>
                  <button onClick={() => remove(i.key)} className="grid size-9 place-items-center text-steel hover:text-red-700" aria-label={`Retirer ${i.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
