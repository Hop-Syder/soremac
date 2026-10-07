/**
 * Contexte de recherche rapide : rend le catalogue disponible au header et au dock mobile,
 * et pilote l'ouverture de la palette (⌘K / Ctrl+K / « / »).
 * @hopsyder
 */
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog/types";
import { QuickSearch } from "./QuickSearch";

interface Ctx { open: () => void }
const SearchCtx = createContext<Ctx>({ open: () => {} });

export function SearchProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchCtx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <QuickSearch products={products} open={isOpen} onOpenChange={setOpen} />
    </SearchCtx.Provider>
  );
}

export const useSearch = () => useContext(SearchCtx);
