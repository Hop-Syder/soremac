/**
 * Boutons « Ajouter au devis » (carte rapide et fiche produit).
 * @hopsyder
 */
"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { useQuote } from "@/components/quote/QuoteProvider";
import { Button } from "@/components/ui/Button";

const toItem = (p: Product, variant: Record<string, string>) => ({
  slug: p.slug,
  category: p.category,
  name: p.name,
  image: p.gallery[0].src,
  unit: p.unit,
  variant,
});

/** Ajout direct depuis une carte : produits sans variante uniquement, sinon renvoi vers la fiche. */
export function AddToQuoteQuick({ product }: { product: Product }) {
  const { add } = useQuote();
  if (product.variants.length) return null;
  return (
    <button
      onClick={() => add(toItem(product, {}))}
      className="flex h-10 items-center gap-1.5 bg-accent px-3 text-[13px] font-semibold text-ink transition-colors hover:bg-accent-2"
      aria-label={`Ajouter ${product.name} au devis`}
    >
      <Plus size={15} /> Devis
    </button>
  );
}

export function AddToQuoteButton({ product, variant, quantity, disabled }: { product: Product; variant: Record<string, string>; quantity: number; disabled?: boolean }) {
  const { add } = useQuote();
  return (
    <Button size="lg" className="w-full" disabled={disabled} onClick={() => add(toItem(product, variant), quantity)}>
      <Plus size={18} /> Ajouter au devis
    </Button>
  );
}
