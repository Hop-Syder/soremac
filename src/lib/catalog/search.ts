/**
 * Moteur de recherche catalogue (TDR §21, Objectif 2).
 * « Fer 12 » → Fer à béton présélectionné en Ø 12 mm.
 * « Sikalatex 20 litres » → Sikalatex présélectionné en 20 L.
 * Insensible aux accents, à la casse et aux unités ; tourne côté client sans dépendance.
 * @hopsyder
 */
import type { Product } from "./types";
import { getCategory } from "./categories";

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Mots ignorés : articles et unités (l'unité est déduite de la variante). */
const STOP = new Set(["de", "du", "des", "la", "le", "les", "a", "pour", "en", "l", "litre", "litres", "kg", "mm", "m", "o"]);

const numeric = (s: string) => {
  const m = s.match(/\d+(?:[.,]\d+)?/);
  return m ? String(parseFloat(m[0].replace(",", "."))) : null;
};

export interface SearchHit {
  product: Product;
  score: number;
  /** Variantes déduites de la requête, ex. { diametre: "12" } */
  preselect: Record<string, string>;
}

export function searchProducts(list: Product[], query: string): SearchHit[] {
  const tokens = normalize(query)
    .split(" ")
    .filter((t) => t && !STOP.has(t));
  if (!tokens.length) return list.map((product) => ({ product, score: 0, preselect: {} }));

  const hits: SearchHit[] = [];
  for (const product of list) {
    const cat = getCategory(product.category);
    const haystack = normalize(
      [product.name, product.brand, product.subcategory, cat?.name, product.summary, ...(product.keywords ?? []), ...Object.values(product.specs)]
        .filter(Boolean)
        .join(" "),
    );
    const words = haystack.split(" ");
    let score = 0;
    let ok = true;
    const preselect: Record<string, string> = {};

    for (const t of tokens) {
      // 1. Le token correspond-il à une option de variante ? (ex. « 12 », « fe500 »)
      const num = numeric(t);
      let matchedVariant = false;
      for (const axis of product.variants) {
        const opt = axis.options.find((o) => normalize(o).replace(/ /g, "") === t || (num !== null && /^\d/.test(t) && numeric(o) === num));
        if (opt && !preselect[axis.key]) {
          preselect[axis.key] = opt;
          matchedVariant = true;
          score += 4;
          break;
        }
      }
      if (matchedVariant) continue;
      // 2. Sinon : correspondance exacte de mot, puis préfixe, puis sous-chaîne
      if (words.includes(t)) score += 3;
      else if (words.some((w) => w.startsWith(t))) score += 2;
      else if (t.length > 2 && haystack.includes(t)) score += 1;
      else {
        ok = false;
        break;
      }
    }
    if (ok) {
      if (normalize(product.name).startsWith(tokens[0])) score += 2;
      hits.push({ product, score, preselect });
    }
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** Construit la query-string de présélection de variantes pour la fiche produit. */
export const preselectQuery = (pre: Record<string, string>) => {
  const qs = new URLSearchParams(pre).toString();
  return qs ? `?${qs}` : "";
};
