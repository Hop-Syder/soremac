/**
 * Drawer « Votre sélection » + toast d'ajout + bouton flottant « Mon devis » (desktop).
 * @hopsyder
 */
"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ClipboardList } from "lucide-react";
import { useQuote } from "./QuoteProvider";
import { QuoteList } from "./QuoteList";
import { QuoteForm } from "./QuoteForm";
import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/motion/tokens";

export function QuoteDrawer() {
  const { open, setOpen, items, count, toast } = useQuote();

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Votre sélection"
        description={count ? `${count} produit${count > 1 ? "s" : ""} dans votre demande` : undefined}
      >
        {items.length ? (
          <div className="px-5 sm:px-6">
            <QuoteList />
            <div className="border-t border-line py-6">
              <p className="mb-4 font-display text-xl font-bold uppercase">Envoyer ma demande de devis</p>
              <QuoteForm compact />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 px-6 py-10">
            <ClipboardList className="text-steel" size={32} />
            <p className="font-display text-2xl font-bold uppercase">Votre demande est vide.</p>
            <p className="text-steel">Ajoutez des produits depuis le catalogue pour composer votre demande de devis.</p>
            <ButtonLink href="/produits" onClick={() => setOpen(false)}>Explorer les produits</ButtonLink>
          </div>
        )}
      </Drawer>

      {/* Bouton flottant desktop — n'apparaît qu'avec une sélection */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-24 z-40 hidden h-14 items-center gap-3 rounded-full bg-ink pl-5 pr-2 text-paper shadow-xl shadow-ink/20 md:flex"
          >
            <ClipboardList size={18} />
            <span className="text-sm font-semibold">Mon devis</span>
            <motion.span key={count} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="tabular grid h-10 min-w-10 place-items-center rounded-full bg-accent px-3 text-sm font-bold text-ink">
              {count}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback d'ajout */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 md:top-auto md:bottom-24">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-4 text-sm text-paper shadow-xl"
            >
              <span className="grid size-7 place-items-center rounded-full bg-accent text-ink"><Check size={14} /></span>
              {toast}
              <button className="ml-2 font-semibold text-accent underline-offset-4 hover:underline" onClick={() => setOpen(true)}>Voir</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
