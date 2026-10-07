/**
 * Géométrie de la maquette holographique SOREMAC.
 * La maison est décrite en 3D (mètres) puis projetée en isométrique : chaque matériau
 * est un calque indépendant (data-part) que la timeline de scroll peut déplacer.
 * @hopsyder
 */

export type Pt = [number, number];
export type V3 = [number, number, number];

const S = 26; // px par mètre
const COS = Math.cos(Math.PI / 6);

/** Projection isométrique : x vers la droite-bas, y vers la gauche-bas, z vers le haut. */
export const P = ([x, y, z]: V3): Pt => [(x - y) * COS * S, (x + y) * 0.5 * S - z * S];

export const pts = (list: V3[]) => list.map((v) => P(v).map((n) => n.toFixed(1)).join(",")).join(" ");
export const line = (a: V3, b: V3) => {
  const [x1, y1] = P(a);
  const [x2, y2] = P(b);
  return { x1: +x1.toFixed(1), y1: +y1.toFixed(1), x2: +x2.toFixed(1), y2: +y2.toFixed(1) };
};

/** Faces visibles d'un parallélépipède (dessus, face x=max, face y=max). */
export function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    top: pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
    right: pts([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]),
    left: pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]),
  };
}

/** Arêtes d'un volume (wireframe complet, y compris arêtes cachées en pointillé). */
export function edges(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const c = (x: number, y: number, z: number): V3 => [x, y, z];
  const visible = [
    [c(x0, y1, z0), c(x1, y1, z0)], [c(x1, y0, z0), c(x1, y1, z0)],
    [c(x0, y0, z1), c(x1, y0, z1)], [c(x1, y0, z1), c(x1, y1, z1)], [c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y1, z1), c(x0, y0, z1)],
    [c(x1, y1, z0), c(x1, y1, z1)], [c(x1, y0, z0), c(x1, y0, z1)], [c(x0, y1, z0), c(x0, y1, z1)],
  ];
  const hidden = [[c(x0, y0, z0), c(x1, y0, z0)], [c(x0, y0, z0), c(x0, y1, z0)], [c(x0, y0, z0), c(x0, y0, z1)]];
  return { visible: visible.map(([a, b]) => line(a, b)), hidden: hidden.map(([a, b]) => line(a, b)) };
}

/* ───────────── Volumes de la maison ───────────── */
export const A = { x0: 0, x1: 9, y0: 0, y1: 6, z0: 0, z1: 3 }; // rez-de-chaussée maçonné
export const B = { x0: 3, x1: 12, y0: -0.5, y1: 5.5, z0: 3, z1: 5.8 }; // étage en porte-à-faux

export type PartKey = "concrete" | "rebar" | "steel" | "tile" | "electricity" | "roof" | "tools";

export interface PartMeta {
  key: PartKey;
  label: string;
  /** Point d'ancrage du label (repère maison) */
  anchor: V3;
  /** Décalage du label par rapport à l'ancre, en px */
  labelAt: Pt;
  /** Déplacement en vue éclatée (px) — desktop */
  explode: Pt;
  /** Visible sur mobile ? */
  mobile: boolean;
}

/** Positions de la vue éclatée : chaque famille garde une relation spatiale lisible avec la maison. */
export const PARTS: PartMeta[] = [
  { key: "roof", label: "TOITURE", anchor: [12.3, 2.5, 6.1], labelAt: [70, -40], explode: [0, -150], mobile: true },
  { key: "tile", label: "CARRELAGE", anchor: [1, 6, 1.5], labelAt: [-150, 40], explode: [-150, 70], mobile: true },
  { key: "rebar", label: "FER", anchor: [9.4, 6.4, 2.6], labelAt: [80, 10], explode: [150, 60], mobile: true },
  { key: "steel", label: "ACIER", anchor: [12, 2.5, 3], labelAt: [80, -30], explode: [170, -70], mobile: false },
  { key: "concrete", label: "BÉTON", anchor: [0, 3, 0.5], labelAt: [-150, -20], explode: [-50, 60], mobile: true },
  { key: "electricity", label: "ÉLECTRICITÉ", anchor: [9, 4.5, 1.2], labelAt: [90, 70], explode: [100, 140], mobile: false },
  { key: "tools", label: "OUTILLAGE", anchor: [3, 10, 0], labelAt: [-150, 30], explode: [-70, 80], mobile: false },
];

/** Cadre global (px) incluant vue éclatée et labels. */
export const VIEWBOX = (() => {
  const corners: V3[] = [];
  for (const v of [A, B]) for (const x of [v.x0, v.x1]) for (const y of [v.y0, v.y1]) for (const z of [v.z0, v.z1 + 0.5]) corners.push([x, y, z]);
  corners.push([20, -4, 0], [2, 11, 0]);
  const ps = corners.map(P);
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  const pad = { x: 165, top: 165, bottom: 130 };
  const minX = Math.min(...xs) - pad.x;
  const minY = Math.min(...ys) - pad.top;
  return { minX, minY, w: Math.max(...xs) + pad.x - minX, h: Math.max(...ys) + pad.bottom - minY };
})();
