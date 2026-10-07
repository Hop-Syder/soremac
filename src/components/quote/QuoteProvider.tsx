/**
 * Devis Builder (TDR §32–33) : panier de demande de devis persistant (localStorage),
 * feedback « Produit ajouté à votre demande. » et ouverture du drawer.
 * On stocke des données sérialisables (slug, nom, variantes) — pas l'objet produit.
 * @hopsyder
 */
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

export interface QuoteItem {
  key: string;
  slug: string;
  category: string;
  name: string;
  image: string;
  unit: string;
  /** ex. { Grade: "Fe500", Diamètre: "12 mm" } */
  variant: Record<string, string>;
  quantity: number;
}

export const variantLabel = (v: Record<string, string>) => Object.values(v).join(" · ");

interface Ctx {
  items: QuoteItem[];
  count: number;
  add: (item: Omit<QuoteItem, "key" | "quantity">, quantity?: number) => void;
  setQty: (key: string, q: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  toast: string | null;
}

const QuoteCtx = createContext<Ctx | null>(null);
const STORAGE = "soremac.quote.v1";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Hydratation depuis le navigateur (try/catch : navigation privée, stockage bloqué)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: Ctx["add"] = useCallback((item, quantity = 1) => {
    const key = `${item.slug}::${JSON.stringify(item.variant)}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { ...item, key, quantity }];
    });
    track("quote_add", { product: item.slug, variant: variantLabel(item.variant) });
    setToast("Produit ajouté à votre demande.");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const setQty = useCallback((key: string, q: number) => {
    setItems((prev) => (q <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, quantity: q } : i))));
  }, []);
  const remove = useCallback((key: string) => setItems((p) => p.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, add, setQty, remove, clear, open, setOpen, toast }),
    [items, add, setQty, remove, clear, open, toast],
  );
  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote doit être utilisé dans <QuoteProvider>");
  return ctx;
}
