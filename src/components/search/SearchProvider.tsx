/**
 * Contexte de recherche rapide : rend le catalogue disponible au header et au dock mobile,
 * et pilote l'ouverture de la palette (icône recherche mobile, dock).
 * @hopsyder
 */
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog/types";
import { QuickSearch } from "./QuickSearch";

interface Ctx { open: () => void }
const SearchCtx = createContext<Ctx>({ open: () => {} });

export function SearchProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);


  return (
    <SearchCtx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <QuickSearch products={products} open={isOpen} onOpenChange={setOpen} />
    </SearchCtx.Provider>
  );
}

export const useSearch = () => useContext(SearchCtx);
