/**
 * Boutons « Ajouter au devis » (carte rapide et fiche produit).
 * @hopsyder
 */
"use client";

import { PlusIcon } from "@phosphor-icons/react/ssr";
import type { Product } from "@/lib/catalog/types";
import { useQuote } from "@/components/quote/QuoteProvider";
import { Button } from "@/components/ui/Button";

const toItem = (p: Product, variant: Record<string, string>) => ({
  slug: p.slug,
  category: p.category,
  name: p.name,
  image: p.gallery[0]?.src ?? "",
  unit: p.unit,
  variant,
});

/** Ajout direct depuis une carte : produits sans variante uniquement, sinon passage par la fiche. */
export function AddToQuoteQuick({ product }: { product: Product }) {
  const { add } = useQuote();
  if (product.variants.length) return null;
  return (
    <button
      onClick={() => add(toItem(product, {}))}
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-accent-2 hover:text-white"
      aria-label={`Ajouter ${product.name} au devis`}
    >
      <PlusIcon size={14} weight="bold" /> Devis
    </button>
  );
}

export function AddToQuoteButton({ product, variant, quantity, disabled }: { product: Product; variant: Record<string, string>; quantity: number; disabled?: boolean }) {
  const { add } = useQuote();
  return (
    <Button size="lg" className="w-full" disabled={disabled} onClick={() => add(toItem(product, variant), quantity)}>
      <PlusIcon size={18} weight="bold" /> Ajouter au devis
    </Button>
  );
}
