/**
 * Maquette architecturale holographique — rendu SVG pur (aucune image, aucun WebGL).
 * Calques (data-plane) pour la parallaxe : 2 outils · 3 structure · 4 toiture/panneaux · 5 camion.
 * Chaque matériau est un groupe data-part piloté par la timeline de scroll (HeroHolo).
 * Survol d'un label → le composant correspondant s'illumine (sans toucher à la timeline).
 * @hopsyder
 */
"use client";

import { useState } from "react";
import { A, B, box, edges, line, P, PARTS, pts, VIEWBOX, type PartKey, type V3 } from "./geometry";

const CY = "#67e8f9"; // cyan
const EB = "#3b82f6"; // bleu électrique
const VI = "#c4b5fd"; // violet léger

const ICONS: Record<PartKey, string> = {
  roof: "M1 8 L7 2 L13 8 M3 7 V13 H11 V7",
  tile: "M1 1h12v12H1z M7 1v12 M1 7h12",
  rebar: "M2 12 L12 2 M2 8 L8 2 M6 12 L12 6",
  steel: "M2 2h10 M2 12h10 M7 2v10",
  concrete: "M1 3h12v8H1z M1 7h12 M5 3v4 M9 7v4",
  electricity: "M8 1 L3 8 H7 L6 13 L11 6 H7 Z",
  tools: "M2 12 L9 5 M7 3 L11 7 M9 1 L13 5",
};

/* ───────── Éléments construits une fois ───────── */

// Grille blueprint au sol
const GRID = (() => {
  const out: ReturnType<typeof line>[] = [];
  for (let x = -4; x <= 18; x++) out.push(line([x, -5, 0], [x, 13, 0]));
  for (let y = -5; y <= 13; y++) out.push(line([-4, y, 0], [18, y, 0]));
  return out;
})();

const aBox = box(A.x0, A.x1, A.y0, A.y1, A.z0, A.z1);
const bBox = box(B.x0, B.x1, B.y0, B.y1, B.z0, B.z1);
const aEdges = edges(A.x0, A.x1, A.y0, A.y1, A.z0, A.z1);
const bEdges = edges(B.x0, B.x1, B.y0, B.y1, B.z0, B.z1);

// Assises de blocs (béton / parpaings) sur les deux faces visibles du RDC
const COURSING = (() => {
  const out: ReturnType<typeof line>[] = [];
  for (let z = 0.4; z < A.z1; z += 0.4) {
    out.push(line([A.x0, A.y1, z], [A.x1, A.y1, z]));
    out.push(line([A.x1, A.y0, z], [A.x1, A.y1, z]));
  }
  for (let i = 0; i * 0.4 < A.z1; i++) {
    const z0 = i * 0.4, z1 = Math.min(z0 + 0.4, A.z1), off = i % 2 ? 0.6 : 0;
    for (let x = 0.6 + off; x < A.x1; x += 1.2) out.push(line([x, A.y1, z0], [x, A.y1, z1]));
    for (let y = 0.6 + off; y < A.y1; y += 1.2) out.push(line([A.x1, y, z0], [A.x1, y, z1]));
  }
  return out;
})();

// Cage d'armatures (poteau d'angle)
const REBAR = (() => {
  const bars: ReturnType<typeof line>[] = [];
  const corners: [number, number][] = [[9.25, 6.25], [9.65, 6.25], [9.65, 6.65], [9.25, 6.65]];
  corners.forEach(([x, y]) => bars.push(line([x, y, -0.1], [x, y, 3.4])));
  const stirrups: string[] = [];
  for (let z = 0.2; z < 3.4; z += 0.32) stirrups.push(pts(corners.map(([x, y]) => [x, y, z] as V3)));
  // armatures en attente sortant du linteau
  const starters = [line([3, 6.1, 3], [3, 6.1, 3.6]), line([5, 6.1, 3], [5, 6.1, 3.6]), line([7, 6.1, 3], [7, 6.1, 3.6])];
  return { bars, stirrups, starters };
})();

// Panneau de carrelage sur la façade (face y = 6)
const TILES = (() => {
  const out: string[] = [];
  const y = A.y1 + 0.04;
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 3; j++) {
      const x0 = 0.5 + i * 0.8, z0 = 0.35 + j * 0.8;
      out.push(pts([[x0, y, z0], [x0 + 0.74, y, z0], [x0 + 0.74, y, z0 + 0.74], [x0, y, z0 + 0.74]]));
    }
  return out;
})();

// Profilés acier sous le porte-à-faux + poteau
const STEEL = (() => {
  const beam = (y: number) => [
    box(8.8, 12, y - 0.12, y + 0.12, 2.72, 3),
  ];
  return {
    beams: [...beam(B.y0 + 0.15), ...beam(B.y1 - 0.15)],
    column: box(11.45, 11.7, 4.95, 5.2, 0, 2.72),
    cross: line([8.8, B.y0 + 0.15, 2.86], [12, B.y1 - 0.15, 2.86]),
  };
})();

// Réseau électrique (lignes holographiques)
const WIRES = [
  pts([[9.02, 4.6, 1.0], [9.02, 4.6, 2.6], [9.02, 2.2, 2.6], [9.02, 2.2, 0.4]]),
  pts([[9.02, 4.6, 2.6], [9.02, 5.4, 2.6], [9.02, 5.4, 3.0], [11.9, 5.4, 3.2]]),
  pts([[9.02, 4.6, 1.6], [9.02, 3.4, 1.6]]),
];
const PANEL = box(9.02, 9.1, 4.3, 4.9, 0.9, 1.5);

// Toiture (dalle + tôles nervurées)
const ROOF = (() => {
  const slab = box(2.7, 12.3, -0.8, 5.8, 5.8, 6.12);
  const ribs: ReturnType<typeof line>[] = [];
  for (let x = 3.1; x < 12.3; x += 0.45) ribs.push(line([x, -0.8, 6.12], [x, 5.8, 6.12]));
  return { slab, ribs };
})();

// Fenêtres (structure)
const WINDOWS = [
  pts([[A.x1 + 0.01, 1, 0.5], [A.x1 + 0.01, 3.6, 0.5], [A.x1 + 0.01, 3.6, 2.6], [A.x1 + 0.01, 1, 2.6]]),
  pts([[4, B.y1 + 0.01, 3.5], [11.4, B.y1 + 0.01, 3.5], [11.4, B.y1 + 0.01, 5.3], [4, B.y1 + 0.01, 5.3]]),
  pts([[B.x1 + 0.01, 0.2, 3.5], [B.x1 + 0.01, 4.8, 3.5], [B.x1 + 0.01, 4.8, 5.3], [B.x1 + 0.01, 0.2, 5.3]]),
];

// Camion + palette (arrière-plan logistique)
const TRUCK = {
  body: box(14, 18.5, -3.6, -1.6, 0.5, 2.6),
  cab: box(18.5, 20, -3.6, -1.6, 0.5, 2),
  pallet: box(14.6, 16, 0.2, 1.4, 0, 0.9),
  wheels: [[15, -1.6, 0.4], [17.6, -1.6, 0.4], [19.4, -1.6, 0.4]] as V3[],
};

// Outils au sol (pictogrammes)
const TOOLS = [
  { at: [1.6, 9.6, 0] as V3, d: "M0 0 h26 v9 h-12 l-3 14 h-6 l3 -14 h-8z M26 3 h10" }, // perceuse
  { at: [4.6, 10.4, 0] as V3, d: "M0 0 h46 v8 h-46z M20 0 v8 M26 0 v8 M22 2 h2 v4 h-2z" }, // niveau
  { at: [6.6, 8.8, 0] as V3, d: "M0 0 h16 v7 h-16z M6 7 v20 h4 v-20" }, // marteau
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({ x: (i * 61) % 100, y: (i * 37) % 100, r: 0.8 + (i % 3) * 0.5, d: 8 + (i % 5) * 2 }));

export function HouseHologram({ mobile = false }: { mobile?: boolean }) {
  const [hover, setHover] = useState<PartKey | null>(null);
  const vb = `${VIEWBOX.minX} ${VIEWBOX.minY} ${VIEWBOX.w} ${VIEWBOX.h}`;
  const show = (k: PartKey) => !mobile || PARTS.find((p) => p.key === k)!.mobile;

  return (
    <svg viewBox={vb} className="holo-house h-full w-full overflow-visible" data-hover={hover ?? undefined} role="img" aria-label="Maquette holographique d'une maison construite avec les matériaux SOREMAC">
      <defs>
        <linearGradient id="hTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={CY} stopOpacity=".22" /><stop offset="1" stopColor={VI} stopOpacity=".08" /></linearGradient>
        <linearGradient id="hLeft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={EB} stopOpacity=".2" /><stop offset="1" stopColor={EB} stopOpacity=".04" /></linearGradient>
        <linearGradient id="hRight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={CY} stopOpacity=".16" /><stop offset="1" stopColor={CY} stopOpacity=".03" /></linearGradient>
        <linearGradient id="hGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".28" /><stop offset=".5" stopColor={CY} stopOpacity=".08" /><stop offset="1" stopColor={VI} stopOpacity=".18" /></linearGradient>
        <radialGradient id="hFloor" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#000" stopOpacity="1" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <mask id="hFloorMask"><rect x={VIEWBOX.minX} y={VIEWBOX.minY} width={VIEWBOX.w} height={VIEWBOX.h} fill="url(#hFloorFade)" /></mask>
        <radialGradient id="hFloorFade" cx=".5" cy=".62" r=".55"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>

      {/* Particules très fines */}
      <g className="holo-particles">
        {PARTICLES.map((p, i) => (
          <circle key={i} cx={VIEWBOX.minX + (p.x / 100) * VIEWBOX.w} cy={VIEWBOX.minY + (p.y / 100) * VIEWBOX.h} r={p.r} fill={CY} style={{ animationDuration: `${p.d}s`, animationDelay: `${-i}s` }} />
        ))}
      </g>

      {/* Grille blueprint */}
      <g mask="url(#hFloorMask)" stroke={CY} strokeOpacity=".16" strokeWidth=".7">
        {GRID.map((l, i) => <line key={i} {...l} />)}
      </g>

      {/* PLAN 5 — camion / logistique */}
      <g data-plane="5" className="holo-plane">
        <g data-part="vehicle" opacity=".55" stroke={CY} strokeWidth=".9" strokeOpacity=".7">
          <polygon points={TRUCK.body.top} fill="url(#hTop)" /><polygon points={TRUCK.body.right} fill="url(#hRight)" /><polygon points={TRUCK.body.left} fill="url(#hLeft)" />
          <polygon points={TRUCK.cab.top} fill="url(#hTop)" /><polygon points={TRUCK.cab.right} fill="url(#hGlass)" /><polygon points={TRUCK.cab.left} fill="url(#hLeft)" />
          <polygon points={TRUCK.pallet.top} fill="url(#hTop)" /><polygon points={TRUCK.pallet.right} fill="url(#hRight)" /><polygon points={TRUCK.pallet.left} fill="url(#hLeft)" />
          {TRUCK.wheels.map((w, i) => { const [cx, cy] = P(w); return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="6" fill="#0b1626" />; })}
        </g>
      </g>

      {/* PLAN 3 — structure + béton + fer + électricité + acier */}
      <g data-plane="3" className="holo-plane">
        {/* Structure : silhouette fantôme qui reste en place pendant la vue éclatée */}
        <g data-part="structure" stroke={CY} fill="none" strokeWidth=".8">
          {[...aEdges.hidden, ...bEdges.hidden].map((l, i) => <line key={`h${i}`} {...l} strokeOpacity=".22" strokeDasharray="4 5" />)}
          {[...aEdges.visible, ...bEdges.visible].map((l, i) => <line key={`v${i}`} {...l} strokeOpacity=".45" />)}
        </g>

        {show("concrete") && (
          <g data-part="concrete" className="holo-part">
            <polygon points={aBox.left} fill="url(#hLeft)" stroke={CY} strokeWidth="1" />
            <polygon points={aBox.right} fill="url(#hRight)" stroke={CY} strokeWidth="1" />
            <polygon points={aBox.top} fill="url(#hTop)" stroke={CY} strokeWidth=".8" strokeOpacity=".6" />
            <g stroke={CY} strokeOpacity=".22" strokeWidth=".6">{COURSING.map((l, i) => <line key={i} {...l} />)}</g>
            <polygon points={WINDOWS[0]} fill="url(#hGlass)" stroke="#e0f7ff" strokeWidth=".9" />
          </g>
        )}

        {show("tile") && (
          <g data-part="tile" className="holo-part">
            {TILES.map((t, i) => <polygon key={i} points={t} fill="url(#hGlass)" stroke="#e0f7ff" strokeWidth=".7" strokeOpacity=".85" />)}
          </g>
        )}

        {show("electricity") && (
          <g data-part="electricity" className="holo-part holo-wires" fill="none">
            {WIRES.map((w, i) => <polyline key={i} points={w} stroke={EB} strokeWidth="1.6" strokeLinejoin="round" />)}
            {WIRES.map((w, i) => <polyline key={`g${i}`} points={w} stroke="#bae6fd" strokeWidth=".8" strokeDasharray="3 7" className="holo-current" />)}
            <polygon points={PANEL.right} fill={EB} fillOpacity=".35" stroke="#bae6fd" strokeWidth=".8" />
          </g>
        )}

        {/* Étage (structure vitrée, reste en place) */}
        <g data-part="upper">
          <polygon points={bBox.left} fill="url(#hLeft)" stroke={CY} strokeWidth="1" />
          <polygon points={bBox.right} fill="url(#hRight)" stroke={CY} strokeWidth="1" />
          <polygon points={WINDOWS[1]} fill="url(#hGlass)" stroke="#e0f7ff" strokeWidth=".9" />
          <polygon points={WINDOWS[2]} fill="url(#hGlass)" stroke="#e0f7ff" strokeWidth=".9" />
        </g>

        {show("steel") && (
          <g data-part="steel" className="holo-part">
            {STEEL.beams.map((b, i) => (
              <g key={i} stroke="#e2e8f0" strokeWidth=".9">
                <polygon points={b.top} fill="#cbd5e1" fillOpacity=".35" /><polygon points={b.right} fill="#94a3b8" fillOpacity=".35" /><polygon points={b.left} fill="#64748b" fillOpacity=".35" />
              </g>
            ))}
            <g stroke="#e2e8f0" strokeWidth=".9">
              <polygon points={STEEL.column.top} fill="#cbd5e1" fillOpacity=".35" /><polygon points={STEEL.column.right} fill="#94a3b8" fillOpacity=".3" /><polygon points={STEEL.column.left} fill="#64748b" fillOpacity=".3" />
            </g>
            <line {...STEEL.cross} stroke="#e2e8f0" strokeOpacity=".5" strokeWidth=".8" strokeDasharray="2 3" />
          </g>
        )}

        {show("rebar") && (
          <g data-part="rebar" className="holo-part" stroke="#e2e8f0" strokeLinecap="round">
            {REBAR.bars.map((l, i) => <line key={i} {...l} strokeWidth="2.2" />)}
            {REBAR.stirrups.map((s, i) => <polygon key={i} points={s} fill="none" strokeWidth=".9" strokeOpacity=".8" />)}
            {REBAR.starters.map((l, i) => <line key={`s${i}`} {...l} strokeWidth="1.8" />)}
          </g>
        )}
      </g>

      {/* PLAN 4 — toiture */}
      <g data-plane="4" className="holo-plane">
        {show("roof") && (
          <g data-part="roof" className="holo-part">
            <polygon points={ROOF.slab.top} fill="url(#hTop)" stroke={CY} strokeWidth="1.1" />
            <polygon points={ROOF.slab.right} fill={CY} fillOpacity=".18" stroke={CY} strokeWidth=".9" />
            <polygon points={ROOF.slab.left} fill={EB} fillOpacity=".2" stroke={CY} strokeWidth=".9" />
            <g stroke="#e0f7ff" strokeOpacity=".45" strokeWidth=".7">{ROOF.ribs.map((l, i) => <line key={i} {...l} />)}</g>
          </g>
        )}
      </g>

      {/* PLAN 2 — outillage */}
      <g data-plane="2" className="holo-plane">
        {show("tools") && (
          <g data-part="tools" className="holo-part" fill="none" stroke="#e0f7ff" strokeWidth="1.2" strokeLinejoin="round">
            {TOOLS.map((t, i) => { const [x, y] = P(t.at); return <path key={i} d={t.d} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) skewY(-12)`} />; })}
          </g>
        )}
      </g>

      {/* Labels holographiques (se déplacent avec leur composant) */}
      <g className="holo-labels">
        {PARTS.filter((p) => show(p.key)).map((p) => {
          const [ax, ay] = P(p.anchor);
          const [dx, dy] = p.labelAt;
          const w = p.label.length * 9.4 + 54;
          const lx = ax + dx - (dx < 0 ? w : 0);
          const ly = ay + dy - 18;
          const ex = dx < 0 ? lx + w : lx;
          return (
            <g key={p.key} data-label={p.key} opacity="0" onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)} className="cursor-default">
              <line x1={ax} y1={ay} x2={ex} y2={ly + 18} stroke={CY} strokeOpacity=".7" strokeWidth=".8" />
              <circle cx={ax} cy={ay} r="2.6" fill={CY} />
              <rect x={lx} y={ly} width={w} height="36" rx="7" fill="#0b1626" fillOpacity=".72" stroke={CY} strokeOpacity=".8" strokeWidth=".9" />
              <path d={ICONS[p.key]} transform={`translate(${lx + 13} ${ly + 11})`} fill="none" stroke={CY} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
              <text x={lx + 38} y={ly + 23} fill="#e0f7ff" fontSize="14" fontWeight="600" letterSpacing="1.5">{p.label}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
