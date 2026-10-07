/**
 * État partagé Hero 3D : écrit par la timeline GSAP (scroll), lu à chaque frame par la scène R3F.
 * Objet mutable (pas de state React) → aucun re-render pendant le scroll.
 * @hopsyder
 */
export type PartKey = "roof" | "tile" | "rebar" | "steel" | "concrete" | "electricity" | "tools";

export interface HeroState {
  /** 0 = vue normale · 1 = caméra rapprochée */
  dolly: number;
  /** rotation légère de la caméra (radians) */
  orbit: number;
  /** recul pour la vue éclatée (0..1) */
  pullback: number;
  /** intensité holographique (lumière, bloom) */
  glow: number;
  /** séparation de chaque famille (0 = assemblée, 1 = vue éclatée) */
  explode: Record<PartKey, number>;
  /** opacité des labels */
  labels: number;
  /** famille survolée (label) */
  hover: PartKey | null;
  /** parallaxe souris normalisée (-1..1) */
  mouse: { x: number; y: number };
  /** rotation 360° choisie par l'utilisateur (radians, cumulative) */
  yaw: number;
  /** rotation automatique 360° activée */
  auto: boolean;
}

export const createHeroState = (): HeroState => ({
  dolly: 0,
  orbit: 0,
  pullback: 0,
  glow: 0,
  explode: { roof: 0, tile: 0, rebar: 0, steel: 0, concrete: 0, electricity: 0, tools: 0 },
  labels: 0,
  hover: null,
  mouse: { x: 0, y: 0 },
  yaw: 0,
  auto: false,
});

/** Vecteurs de vue éclatée (mètres) : chaque famille garde une relation spatiale avec la maison. */
export const EXPLODE: Record<PartKey, [number, number, number]> = {
  roof: [0, 3.4, 0], // ↑
  tile: [-1.2, 0.2, 3.6], // vers l'avant-gauche
  rebar: [3.2, 0.4, 2.2], // →
  steel: [3.4, 1.8, -1.2], // ↗
  concrete: [-2.4, -0.2, -2.2], // ↙ arrière
  electricity: [1.6, -0.6, 3.8], // ↘
  tools: [-3.4, 0, 2.4], // ↙ avant
};

/** Labels de la vue éclatée — cliquables vers la famille correspondante du catalogue. */
export const LABELS: { key: PartKey; label: string; at: [number, number, number]; mobile: boolean; href: string; hint: string }[] = [
  { key: "roof", label: "TOITURE", at: [3.6, 6.6, 0], mobile: true, href: "/produits/toiture-couverture", hint: "Tôles · Toiturol" },
  { key: "tile", label: "CARRELAGE", at: [-3.6, 2.6, 3.2], mobile: true, href: "/produits/carrelage-revetements", hint: "Sol & mur" },
  { key: "rebar", label: "FER", at: [5.2, 3.6, 3.4], mobile: true, href: "/produits/acier-fer/fer-a-beton", hint: "Fe400 · Fe500 · Ø6–32" },
  { key: "steel", label: "ACIER", at: [7.6, 3.6, -0.6], mobile: false, href: "/produits/acier-fer", hint: "Profilés · poutres" },
  { key: "concrete", label: "BÉTON", at: [-5.4, 1.2, 0.6], mobile: true, href: "/produits/cimenterie-liants", hint: "Ciment · Sika · blocs" },
  { key: "electricity", label: "ÉLECTRICITÉ", at: [4.8, 0.9, 3.2], mobile: false, href: "/produits/electricite", hint: "Câbles · tableaux" },
  { key: "tools", label: "OUTILLAGE", at: [-2.4, 0.6, 5.2], mobile: false, href: "/produits/quincaillerie-outillage", hint: "Outils · quincaillerie" },
];
