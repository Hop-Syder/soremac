/** Contenu interactif de la page devis. @hopsyder */
"use client";

import { useState } from "react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { QuoteList } from "@/components/quote/QuoteList";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { Button, ButtonLink } from "@/components/ui/Button";

export function QuotePageClient() {
  const { items, add } = useQuote();
  const [free, setFree] = useState("");

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <h2 className="font-display text-3xl font-bold uppercase">Votre sélection</h2>
        {items.length ? (
          <QuoteList />
        ) : (
          <div className="mt-4 border border-dashed border-line bg-white p-8">
            <p className="text-steel">Aucun produit pour l'instant. Parcourez le catalogue ou ajoutez librement un besoin ci-dessous.</p>
            <ButtonLink href="/produits" variant="outline" className="mt-5">Explorer les produits</ButtonLink>
          </div>
        )}
        {/* Saisie libre : pour les références pas encore en ligne */}
        <form
          className="mt-8 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!free.trim()) return;
            add({ slug: `libre-${Date.now()}`, category: "", name: free.trim(), image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=60", unit: "unité(s)", variant: {} });
            setFree("");
          }}
        >
          <label className="flex-1">
            <span className="sr-only">Ajouter un besoin libre</span>
            <input value={free} onChange={(e) => setFree(e.target.value)} placeholder="Autre besoin : ex. treillis soudé, gravier…" className="h-12 w-full border border-line bg-white px-3.5 outline-none focus:border-ink" />
          </label>
          <Button type="submit" variant="dark">Ajouter</Button>
        </form>
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="bg-white p-6 md:p-8">
          <h2 className="mb-5 font-display text-3xl font-bold uppercase">Vos coordonnées</h2>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
