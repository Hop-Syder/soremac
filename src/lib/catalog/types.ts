/**
 * Modèle de données catalogue (TDR §45) — extensible et prêt pour un CMS (Supabase / headless).
 * @hopsyder
 */

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  /** Taille dans la grille éditoriale de la homepage */
  size: "xl" | "lg" | "md" | "sm";
  /** Catégories complémentaires pour le cross-selling (TDR §31) */
  related: string[];
  seoTitle?: string;
  seoDescription?: string;
}

/** Axe de variante : diamètre, grade, conditionnement, format… (TDR §28) */
export interface VariantAxis {
  key: string;
  label: string;
  unit?: string;
  options: string[];
}

export interface ProductImage {
  src: string;
  alt: string;
  /** Rôle éditorial : vue principale, détail, packaging, usage… (TDR §46) */
  role?: "main" | "side" | "detail" | "packaging" | "texture" | "dimensions" | "usage" | "site";
}

export interface ProductDocument {
  label: string;
  href: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  summary: string;
  /** Contenu éditorial — chaque bloc n'est affiché que s'il est renseigné */
  presentation: string;
  usage?: string;
  advice?: string;
  gallery: ProductImage[];
  /** Caractéristiques vérifiées uniquement — jamais inventées (TDR §6 règle 7) */
  specs: Record<string, string>;
  variants: VariantAxis[];
  /** Unité de commande proposée dans le devis */
  unit: string;
  packaging?: string;
  badge?: string;
  /** Message d'authenticité spécifique (TDR §17) */
  authenticity?: string;
  documents?: ProductDocument[];
  featured?: boolean;
  popular?: boolean;
  related?: string[];
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: "published" | "draft";
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  image: string;
  /** Catégories produit vers lesquelles l'article renvoie */
  productCategories: string[];
  body: { heading: string; text: string }[];
}
