/**
 * Langage de motion unique du site (TDR §34) — toutes les animations y puisent.
 * @hopsyder
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.25, // header, hover
  base: 0.4, // drawers, galerie
  reveal: 0.6, // apparitions au scroll
} as const;

/** Décalage entre éléments d'une liste (50–80 ms) */
export const STAGGER = 0.065;
/** Translation maximale d'un reveal (10–24 px) */
export const RISE = 18;
