/**
 * Maison contemporaine modélisée en code (Three.js / React Three Fiber).
 * Unités : mètres. x → droite, y → haut, z → vers la caméra.
 * RDC maçonné (parpaings instanciés) · étage vitré en porte-à-faux · toiture nervurée ·
 * cage d'armatures · profilés acier · carrelage irisé · réseau électrique · outils · camion.
 * Chaque famille = un groupe déplacé par la séquence de scroll (state.explode[key]).
 * @hopsyder
 */
"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { EXPLODE, LABELS, type HeroState, type PartKey } from "./state";

/* ───────────── Textures procédurales (générées en code, aucun fichier) ───────────── */
function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat: [number, number] = [1, 1]) {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
/** Béton de parpaing : grain + pores */
const concreteTex = canvasTexture(256, 256, (c) => {
  c.fillStyle = "#9aa6b2"; c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const v = 120 + Math.random() * 70;
    c.fillStyle = `rgba(${v},${v + 6},${v + 14},${0.25 + Math.random() * 0.35})`;
    c.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  for (let i = 0; i < 260; i++) { c.fillStyle = "rgba(40,48,58,.45)"; c.beginPath(); c.arc(Math.random() * 256, Math.random() * 256, Math.random() * 1.6, 0, 7); c.fill(); }
});
/** Tôle : métal brossé */
const metalTex = canvasTexture(256, 64, (c) => {
  c.fillStyle = "#a8b6c6"; c.fillRect(0, 0, 256, 64);
  for (let y = 0; y < 64; y++) { const v = 150 + Math.random() * 60; c.fillStyle = `rgba(${v},${v + 8},${v + 18},.35)`; c.fillRect(0, y, 256, 1); }
}, [1, 4]);
/** Lames de bois de la terrasse */
const woodTex = canvasTexture(512, 64, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, "#8a5a3b"); g.addColorStop(1, "#6e4630");
  c.fillStyle = g; c.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(40,22,12,${0.15 + Math.random() * 0.2})`; c.beginPath(); const y = Math.random() * 64; c.moveTo(0, y); c.bezierCurveTo(170, y + 6, 340, y - 6, 512, y + Math.random() * 4); c.stroke(); }
});

/* ───────────── Matériaux ───────────── */
const HOLO = new THREE.Color(0.55, 2.1, 2.6); // cyan > 1 → capté par le bloom
const mat = {
  block: new THREE.MeshStandardMaterial({ color: "#c3cdd8", map: concreteTex, roughness: 0.92, metalness: 0.02, emissive: "#0e7490", emissiveIntensity: 0.05 }),
  slab: new THREE.MeshStandardMaterial({ color: "#5f748c", roughness: 0.9, emissive: "#0e7490", emissiveIntensity: 0.06 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#9bd7f5", roughness: 0.06, metalness: 0.2, clearcoat: 1, envMapIntensity: 1.6, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
  frame: new THREE.MeshStandardMaterial({ color: "#1f2a37", roughness: 0.5, metalness: 0.6 }),
  roof: new THREE.MeshStandardMaterial({ color: "#c6d2df", map: metalTex, roughness: 0.32, metalness: 0.8, emissive: "#0891b2", emissiveIntensity: 0.05 }),
  wood: new THREE.MeshStandardMaterial({ color: "#ffffff", map: woodTex, roughness: 0.7, metalness: 0 }),
  warm: new THREE.MeshStandardMaterial({ color: "#ffd9a8", emissive: "#ffb066", emissiveIntensity: 2.2, toneMapped: false }),
  interior: new THREE.MeshStandardMaterial({ color: "#3a3129", emissive: "#ffb27a", emissiveIntensity: 0.12, roughness: 0.9 }),
  leaf: new THREE.MeshStandardMaterial({ color: "#3f6b4f", roughness: 0.9, flatShading: true, emissive: "#0f766e", emissiveIntensity: 0.08 }),
  trunk: new THREE.MeshStandardMaterial({ color: "#5b4636", roughness: 1 }),
  paver: new THREE.MeshStandardMaterial({ color: "#8d99a6", map: concreteTex, roughness: 0.95 }),
  rebar: new THREE.MeshStandardMaterial({ color: "#c9ced6", roughness: 0.32, metalness: 1, emissive: "#22d3ee", emissiveIntensity: 0.04 }),
  steel: new THREE.MeshStandardMaterial({ color: "#8a96a8", roughness: 0.28, metalness: 0.95, emissive: "#1d4ed8", emissiveIntensity: 0.04 }),
  tile: new THREE.MeshPhysicalMaterial({ color: "#f5f7fa", roughness: 0.12, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 620] }),
  wire: new THREE.MeshStandardMaterial({ color: "#1e3a8a", emissive: "#3b82f6", emissiveIntensity: 2.4, toneMapped: false }),
  spark: new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 2.6, 3), toneMapped: false }),
  panel: new THREE.MeshStandardMaterial({ color: "#0f172a", emissive: "#3b82f6", emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.4 }),
  tool: new THREE.MeshStandardMaterial({ color: "#f2701d", roughness: 0.45, metalness: 0.2, emissive: "#f2701d", emissiveIntensity: 0.12 }),
  toolDark: new THREE.MeshStandardMaterial({ color: "#2a313c", roughness: 0.5, metalness: 0.6 }),
  holo: new THREE.MeshStandardMaterial({ color: "#67e8f9", transparent: true, opacity: 0.12, emissive: "#22d3ee", emissiveIntensity: 0.3, depthWrite: false }),
  edge: new THREE.LineBasicMaterial({ color: HOLO, toneMapped: false, transparent: true, opacity: 0.75 }),
};

/** Matériaux par famille → surbrillance au survol de son label. */
const PART_MATS: Record<PartKey, THREE.MeshStandardMaterial[]> = {
  roof: [mat.roof],
  tile: [mat.tile],
  rebar: [mat.rebar],
  steel: [mat.steel],
  concrete: [mat.block, mat.slab],
  electricity: [mat.wire, mat.panel],
  tools: [mat.tool],
};
const BASE_EMISSIVE = new Map<THREE.MeshStandardMaterial, number>(Object.values(PART_MATS).flat().map((m) => [m, m.emissiveIntensity]));

/* ───────────── Primitives ───────────── */
type V3 = [number, number, number];

/** Boîte avec arêtes holographiques optionnelles. */
function Block({ size, position, material, edges = false, rotation }: { size: V3; position: V3; material: THREE.Material; edges?: boolean; rotation?: V3 }) {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edgeGeo = useMemo(() => (edges ? new THREE.EdgesGeometry(geo) : null), [geo, edges]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={material} castShadow receiveShadow />
      {edgeGeo && <lineSegments geometry={edgeGeo} material={mat.edge} />}
    </group>
  );
}

/** Instanced mesh à partir d'une liste de matrices. */
function Instances({ geometry, material, items }: { geometry: THREE.BufferGeometry; material: THREE.Material; items: { p: V3; r?: V3; s?: V3 }[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    items.forEach((it, i) => {
      q.setFromEuler(new THREE.Euler(...(it.r ?? [0, 0, 0])));
      m.compose(new THREE.Vector3(...it.p), q, new THREE.Vector3(...(it.s ?? [1, 1, 1])));
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow receiveShadow />;
}

/* ───────────── Géométrie de la maison ───────────── */
const A = { x0: -4.5, x1: 4.5, z0: -3, z1: 3, h: 3 }; // RDC
const B = { x0: -1.5, x1: 7.5, z0: -3.5, z1: 2.5, y0: 3, y1: 5.8 }; // étage

/** Parpaings : 4 murs, assises décalées, ouvertures (baie + porte). */
function useBlocks() {
  return useMemo(() => {
    const L = 0.6, H = 0.3, T = 0.3;
    const out: { p: V3; r?: V3 }[] = [];
    const opening = (axis: "x" | "z", u: number, y: number) =>
      (axis === "z" && u > -2.2 && u < 1 && y > 0.5 && y < 2.4) || // baie côté droit
      (axis === "x" && u > 1.6 && u < 2.8 && y < 2.3); // porte façade avant
    for (let row = 0; row < A.h / H; row++) {
      const y = row * H + H / 2;
      const off = row % 2 ? L / 2 : 0;
      for (let x = A.x0 + L / 2 - off; x < A.x1; x += L) {
        if (x < A.x0 + 0.1) continue;
        if (!opening("x", x, y)) out.push({ p: [x, y, A.z1 - T / 2] });
        out.push({ p: [x, y, A.z0 + T / 2] });
      }
      for (let z = A.z0 + L / 2 + off; z < A.z1; z += L) {
        if (z > A.z1 - 0.1) continue;
        if (!opening("z", z, y)) out.push({ p: [A.x1 - T / 2, y, z], r: [0, Math.PI / 2, 0] });
        out.push({ p: [A.x0 + T / 2, y, z], r: [0, Math.PI / 2, 0] });
      }
    }
    return { geo: new THREE.BoxGeometry(L * 0.96, H * 0.9, T), items: out };
  }, []);
}

/* ───────────── Familles ───────────── */

function Concrete() {
  const { geo, items } = useBlocks();
  return (
    <>
      <Instances geometry={geo} material={mat.block} items={items} />
      <Block size={[9.6, 0.3, 6.6]} position={[0, -0.15, 0]} material={mat.slab} edges />
    </>
  );
}

function Upper() {
  // Volume vitré + dalle + menuiseries (structure, reste en place)
  const mullions = useMemo(() => Array.from({ length: 7 }, (_, i) => B.x0 + 0.6 + i * 1.3), []);
  return (
    <group>
      <Block size={[B.x1 - B.x0 + 0.2, 0.28, B.z1 - B.z0 + 0.2]} position={[(B.x0 + B.x1) / 2, B.y0 + 0.14, (B.z0 + B.z1) / 2]} material={mat.slab} edges />
      <Block size={[B.x1 - B.x0, B.y1 - B.y0 - 0.28, B.z1 - B.z0]} position={[(B.x0 + B.x1) / 2, (B.y0 + 0.28 + B.y1) / 2, (B.z0 + B.z1) / 2]} material={mat.glass} edges />
      {mullions.map((x) => <Block key={x} size={[0.06, B.y1 - B.y0 - 0.28, 0.06]} position={[x, (B.y0 + 0.28 + B.y1) / 2, B.z1]} material={mat.frame} />)}
      <Block size={[0.06, B.y1 - B.y0 - 0.28, 0.06]} position={[B.x1, (B.y0 + 0.28 + B.y1) / 2, B.z1]} material={mat.frame} />
      {/* Baie + porte du RDC */}
      <Block size={[0.04, 1.9, 3.2]} position={[A.x1 - 0.12, 1.45, -0.6]} material={mat.glass} edges />
      <Block size={[1.2, 2.3, 0.06]} position={[2.2, 1.15, A.z1 - 0.1]} material={mat.frame} edges />
      <Block size={[0.05, 0.3, 0.05]} position={[2.65, 1.1, A.z1 - 0.04]} material={mat.steel} />
      {/* Intérieur chaleureux visible à travers les vitrages */}
      <Block size={[B.x1 - B.x0 - 0.4, 0.04, B.z1 - B.z0 - 0.4]} position={[(B.x0 + B.x1) / 2, B.y0 + 0.3, (B.z0 + B.z1) / 2]} material={mat.interior} />
      <Block size={[3.4, 0.04, 2.2]} position={[A.x1 - 1.9, 0.04, -0.6]} material={mat.interior} />
      <pointLight position={[3, 4.6, -0.5]} color="#ffb066" intensity={14} distance={9} decay={1.8} />
      {/* Appliques murales */}
      {[1.3, 3.1].map((x) => <Block key={x} size={[0.16, 0.26, 0.08]} position={[x, 2.15, A.z1 + 0.05]} material={mat.warm} />)}
      {/* Gouttière + descente */}
      <mesh position={[(B.x0 + B.x1) / 2, B.y1 + 0.02, B.z1 + 0.32]} rotation={[0, 0, Math.PI / 2]} material={mat.steel}><cylinderGeometry args={[0.07, 0.07, B.x1 - B.x0 + 0.6, 12]} /></mesh>
      <mesh position={[B.x1 + 0.2, B.y1 / 2, B.z1 + 0.32]} material={mat.steel}><cylinderGeometry args={[0.05, 0.05, B.y1, 10]} /></mesh>
    </group>
  );
}

/** Terrasse en bois sous le porte-à-faux + allée + végétation (réalisme, reste en place). */
function Landscape() {
  const planks = useMemo(() => {
    const items: { p: V3 }[] = [];
    for (let z = B.z0 + 0.2; z < B.z1 - 0.1; z += 0.2) items.push({ p: [(A.x1 + B.x1) / 2 + 0.1, 0.06, z] });
    return { geo: new THREE.BoxGeometry(B.x1 - A.x1 - 0.2, 0.06, 0.17), items };
  }, []);
  const pavers = useMemo(() => {
    const items: { p: V3 }[] = [];
    for (let i = 0; i < 6; i++) items.push({ p: [2.2 + (i % 2 ? 0.15 : -0.15), 0.02, A.z1 + 0.6 + i * 0.75] });
    return { geo: new THREE.BoxGeometry(1.1, 0.05, 0.55), items };
  }, []);
  const trees: { p: V3; s: number }[] = [
    { p: [-6.4, 0, 3.2], s: 1.1 },
    { p: [-6.8, 0, -1.6], s: 1.4 },
    { p: [9.4, 0, 3.8], s: 0.9 },
  ];
  return (
    <group>
      <Instances geometry={planks.geo} material={mat.wood} items={planks.items} />
      <Instances geometry={pavers.geo} material={mat.paver} items={pavers.items} />
      {trees.map((t, i) => (
        <group key={i} position={t.p} scale={t.s}>
          <mesh position={[0, 0.7, 0]} material={mat.trunk} castShadow><cylinderGeometry args={[0.08, 0.12, 1.4, 8]} /></mesh>
          <mesh position={[0, 1.9, 0]} material={mat.leaf} castShadow><icosahedronGeometry args={[0.85, 1]} /></mesh>
          <mesh position={[0.35, 1.45, 0.2]} material={mat.leaf} castShadow><icosahedronGeometry args={[0.55, 1]} /></mesh>
        </group>
      ))}
      {/* Jardinière basse en blocs */}
      <Block size={[2.6, 0.45, 0.5]} position={[-2.8, 0.22, A.z1 + 1.2]} material={mat.block} />
      {[-3.6, -2.8, -2].map((x) => <mesh key={x} position={[x, 0.62, A.z1 + 1.2]} material={mat.leaf} castShadow><icosahedronGeometry args={[0.32, 0]} /></mesh>)}
    </group>
  );
}

function Roof() {
  const ribs = useMemo(() => {
    const items: { p: V3 }[] = [];
    for (let x = B.x0 - 0.2; x <= B.x1 + 0.2; x += 0.36) items.push({ p: [x, B.y1 + 0.36, (B.z0 + B.z1) / 2] });
    return { geo: new THREE.BoxGeometry(0.07, 0.08, B.z1 - B.z0 + 0.6), items };
  }, []);
  return (
    <>
      <Block size={[B.x1 - B.x0 + 0.6, 0.3, B.z1 - B.z0 + 0.6]} position={[(B.x0 + B.x1) / 2, B.y1 + 0.15, (B.z0 + B.z1) / 2]} material={mat.roof} edges />
      <Instances geometry={ribs.geo} material={mat.roof} items={ribs.items} />
    </>
  );
}

function Rebar() {
  const data = useMemo(() => {
    const bar = new THREE.CylinderGeometry(0.045, 0.045, 1, 10);
    const cx = A.x1 + 0.45, cz = A.z1 + 0.45, s = 0.32;
    const bars = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => ({ p: [cx + a * s / 2, 1.85, cz + b * s / 2] as V3, s: [1, 3.9, 1] as V3 }));
    // armatures en attente au sommet du mur avant
    for (let x = -3.6; x <= 3.6; x += 1.8) bars.push({ p: [x, A.h + 0.35, A.z1 - 0.15], s: [0.8, 0.7, 0.8] });
    const stirrups: { p: V3; r?: V3; s?: V3 }[] = [];
    const st = new THREE.BoxGeometry(s + 0.06, 0.025, 0.025);
    for (let y = 0.15; y < 3.8; y += 0.3) {
      stirrups.push({ p: [cx, y, cz - s / 2] }, { p: [cx, y, cz + s / 2] });
      stirrups.push({ p: [cx - s / 2, y, cz], r: [0, Math.PI / 2, 0] }, { p: [cx + s / 2, y, cz], r: [0, Math.PI / 2, 0] });
    }
    return { bar, bars, st, stirrups };
  }, []);
  return (
    <>
      <Instances geometry={data.bar} material={mat.rebar} items={data.bars} />
      <Instances geometry={data.st} material={mat.rebar} items={data.stirrups} />
    </>
  );
}

/** Profilé en I (HEA) le long de x. */
function IBeam({ length, position, vertical = false }: { length: number; position: V3; vertical?: boolean }) {
  const r: V3 = vertical ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return (
    <group position={position} rotation={r}>
      <Block size={[length, 0.04, 0.26]} position={[0, 0.13, 0]} material={mat.steel} />
      <Block size={[length, 0.04, 0.26]} position={[0, -0.13, 0]} material={mat.steel} />
      <Block size={[length, 0.24, 0.035]} position={[0, 0, 0]} material={mat.steel} />
    </group>
  );
}

function Steel() {
  const len = B.x1 - A.x1 + 0.4;
  const cx = A.x1 + len / 2 - 0.2;
  return (
    <>
      <IBeam length={len} position={[cx, B.y0 - 0.15, B.z0 + 0.25]} />
      <IBeam length={len} position={[cx, B.y0 - 0.15, B.z1 - 0.25]} />
      <IBeam length={B.y0 - 0.3} position={[B.x1 - 0.35, (B.y0 - 0.3) / 2, B.z1 - 0.25]} vertical />
      <IBeam length={B.y0 - 0.3} position={[B.x1 - 0.35, (B.y0 - 0.3) / 2, B.z0 + 0.25]} vertical />
    </>
  );
}

function Tiles() {
  const items = useMemo(() => {
    const out: { p: V3 }[] = [];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) out.push({ p: [-4 + 0.4 + i * 0.82, 0.55 + j * 0.82, A.z1 + 0.04] });
    return out;
  }, []);
  const geo = useMemo(() => new THREE.BoxGeometry(0.76, 0.76, 0.05), []);
  return <Instances geometry={geo} material={mat.tile} items={items} />;
}

function Electricity() {
  const curves = useMemo(() => {
    const x = A.x1 + 0.03;
    const pts = (l: V3[]) => new THREE.CatmullRomCurve3(l.map((v) => new THREE.Vector3(...v)), false, "catmullrom", 0.05);
    return [
      pts([[x, 1.1, 2.1], [x, 2.6, 2.1], [x, 2.6, -2.4], [x, 0.4, -2.4]]),
      pts([[x, 2.6, 2.1], [x, 3.4, 2.4], [6.5, 3.4, 2.4], [7.2, 4.2, 2.4]]),
      pts([[x, 1.6, 2.1], [x, 1.6, 1.2]]),
    ];
  }, []);
  const tubes = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 64, 0.03, 6, false)), [curves]);
  const sparks = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    sparks.current.forEach((m, i) => {
      if (!m) return;
      const t = (clock.elapsedTime * 0.25 + i * 0.33) % 1;
      m.position.copy(curves[i % curves.length].getPointAt(t));
    });
  });
  return (
    <>
      {tubes.map((g, i) => <mesh key={i} geometry={g} material={mat.wire} />)}
      {[0, 1, 2].map((i) => (
        <mesh key={`s${i}`} ref={(m) => { if (m) sparks.current[i] = m; }} material={mat.spark}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
      ))}
      <Block size={[0.08, 0.7, 0.5]} position={[A.x1 + 0.05, 1.2, 2.1]} material={mat.panel} edges />
    </>
  );
}

function Tools() {
  return (
    <group position={[-2.2, 0, 4.8]}>
      {/* Perceuse */}
      <group position={[0, 0.16, 0]} rotation={[0, 0.6, 0]}>
        <Block size={[0.5, 0.16, 0.14]} position={[0, 0.2, 0]} material={mat.tool} />
        <Block size={[0.12, 0.32, 0.12]} position={[-0.12, 0, 0]} material={mat.toolDark} />
        <mesh position={[0.32, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} material={mat.toolDark}><cylinderGeometry args={[0.03, 0.03, 0.18, 8]} /></mesh>
      </group>
      {/* Niveau */}
      <Block size={[1.2, 0.07, 0.12]} position={[1.1, 0.04, 0.5]} rotation={[0, -0.3, 0]} material={mat.tool} />
      {/* Marteau */}
      <group position={[0.3, 0.04, 1.1]} rotation={[0, 1.1, 0]}>
        <Block size={[0.6, 0.05, 0.05]} position={[0, 0, 0]} material={mat.toolDark} />
        <Block size={[0.1, 0.08, 0.22]} position={[0.3, 0.02, 0]} material={mat.toolDark} />
      </group>
    </group>
  );
}

/* ───────────── Camion de livraison SOREMAC (plateau chargé) ───────────── */
const truckMat = {
  paint: new THREE.MeshPhysicalMaterial({ color: "#f2701d", roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }),
  white: new THREE.MeshPhysicalMaterial({ color: "#f3f5f7", roughness: 0.35, metalness: 0.2, clearcoat: 0.8 }),
  dark: new THREE.MeshStandardMaterial({ color: "#1b2129", roughness: 0.55, metalness: 0.6 }),
  chrome: new THREE.MeshStandardMaterial({ color: "#dfe5ec", roughness: 0.15, metalness: 1 }),
  rubber: new THREE.MeshStandardMaterial({ color: "#121417", roughness: 0.9 }),
  rim: new THREE.MeshStandardMaterial({ color: "#aab4c0", roughness: 0.3, metalness: 0.9 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#0f2a3d", roughness: 0.05, metalness: 0.4, clearcoat: 1, envMapIntensity: 2 }),
  head: new THREE.MeshStandardMaterial({ color: "#fff6e0", emissive: "#fff1c9", emissiveIntensity: 2.4, toneMapped: false }),
  tail: new THREE.MeshStandardMaterial({ color: "#ff3b30", emissive: "#ff2d20", emissiveIntensity: 1.6, toneMapped: false }),
  bed: new THREE.MeshStandardMaterial({ color: "#3a434e", roughness: 0.7, metalness: 0.5 }),
  bag: new THREE.MeshStandardMaterial({ color: "#d8cdb6", roughness: 0.95 }),
  bagBand: new THREE.MeshStandardMaterial({ color: "#2f6fb5", roughness: 0.8 }),
  carton: new THREE.MeshStandardMaterial({ color: "#c9a77c", roughness: 0.9 }),
  pallet: new THREE.MeshStandardMaterial({ color: "#a07850", roughness: 0.9 }),
};

function Wheel({ x, z }: { x: number; z: number }) {
  const side = Math.sign(z);
  return (
    <group position={[x, 0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={truckMat.rubber} castShadow><cylinderGeometry args={[0.5, 0.5, 0.36, 28]} /></mesh>
      <mesh material={truckMat.rim} position={[0, side * 0.19, 0]}><cylinderGeometry args={[0.3, 0.3, 0.04, 20]} /></mesh>
      <mesh material={truckMat.chrome} position={[0, side * 0.215, 0]}><cylinderGeometry args={[0.09, 0.09, 0.03, 12]} /></mesh>
    </group>
  );
}

function Vehicle() {
  // Repère local : x = longueur (avant en +x), z = largeur
  const rebar = useMemo(() => {
    const items: { p: V3; r: V3 }[] = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) items.push({ p: [-0.6, 1.33 + j * 0.07, -0.15 + i * 0.075], r: [0, 0, Math.PI / 2] });
    return { geo: new THREE.CylinderGeometry(0.03, 0.03, 4.4, 8), items };
  }, []);
  const bags = useMemo(() => {
    const items: { p: V3 }[] = [];
    for (let l = 0; l < 3; l++) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) items.push({ p: [-2.25 + i * 0.62, 1.47 + l * 0.2, 0.42 + j * 0.42] });
    return { geo: new THREE.BoxGeometry(0.58, 0.18, 0.4), items };
  }, []);
  return (
    <group position={[3.2, 0, -8.6]} rotation={[0, -0.12, 0]} scale={0.95}>
      {/* Châssis + pare-chocs */}
      <Block size={[6.9, 0.28, 1.1]} position={[0, 0.82, 0]} material={truckMat.dark} />
      <Block size={[0.22, 0.32, 2.3]} position={[3.55, 0.72, 0]} material={truckMat.dark} />
      <Block size={[0.18, 0.18, 2.2]} position={[-3.45, 0.82, 0]} material={truckMat.dark} />

      {/* Cabine carrossée */}
      <group position={[2.55, 0, 0]}>
        <RoundedBox args={[1.9, 1.95, 2.3]} radius={0.16} smoothness={4} position={[0, 1.95, 0]} material={truckMat.paint} castShadow />
        <RoundedBox args={[1.92, 0.5, 2.32]} radius={0.12} smoothness={4} position={[0, 1.12, 0]} material={truckMat.white} castShadow />
        {/* Pare-brise incliné + vitres latérales */}
        <mesh position={[0.97, 2.35, 0]} rotation={[0, 0, -0.08]} material={truckMat.glass}><boxGeometry args={[0.04, 0.8, 2.05]} /></mesh>
        {[-1.16, 1.16].map((z) => <mesh key={z} position={[0.15, 2.35, z]} material={truckMat.glass}><boxGeometry args={[1.1, 0.7, 0.03]} /></mesh>)}
        {/* Calandre, phares, clignotants */}
        <Block size={[0.04, 0.42, 1.2]} position={[0.97, 1.45, 0]} material={truckMat.dark} />
        {[-0.85, 0.85].map((z) => <Block key={z} size={[0.05, 0.16, 0.34]} position={[0.98, 1.3, z]} material={truckMat.head} />)}
        {/* Rétroviseurs */}
        {[-1.32, 1.32].map((z) => (
          <group key={z}>
            <Block size={[0.04, 0.04, 0.22]} position={[0.75, 2.35, z - Math.sign(z) * 0.1]} material={truckMat.dark} />
            <Block size={[0.06, 0.32, 0.12]} position={[0.78, 2.3, z]} material={truckMat.dark} />
          </group>
        ))}
        {/* Panneau de porte (logo) */}
        {[-1.165, 1.165].map((z) => <Block key={z} size={[0.7, 0.32, 0.01]} position={[-0.25, 1.7, z]} material={truckMat.white} />)}
      </group>

      {/* Plateau */}
      <Block size={[4.9, 0.14, 2.3]} position={[-0.95, 1.08, 0]} material={truckMat.bed} />
      {[-1.15, 1.15].map((z) => <Block key={z} size={[4.9, 0.24, 0.06]} position={[-0.95, 1.27, z]} material={truckMat.paint} />)}
      <Block size={[0.08, 0.9, 2.3]} position={[1.55, 1.6, 0]} material={truckMat.dark} />
      {[-0.8, 0, 0.8].map((z) => <Block key={z} size={[0.08, 0.9, 0.06]} position={[1.55, 1.6, z]} material={truckMat.chrome} />)}

      {/* Chargement : botte de fers à béton */}
      <Instances geometry={rebar.geo} material={mat.rebar} items={rebar.items} />
      {[-2.2, -0.6, 1].map((x) => <Block key={x} size={[0.06, 0.34, 0.42]} position={[x, 1.4, 0.0]} material={truckMat.bagBand} />)}

      {/* Palette de sacs de ciment */}
      <Block size={[1.3, 0.12, 0.9]} position={[-1.94, 1.21, 0.63]} material={truckMat.pallet} />
      <Instances geometry={bags.geo} material={truckMat.bag} items={bags.items} />

      {/* Cartons de carrelage */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0.55, 1.29 + i * 0.16, -0.62]}>
          <Block size={[0.95, 0.15, 0.62]} position={[0, 0, 0]} material={truckMat.carton} />
          <Block size={[0.96, 0.04, 0.63]} position={[0, 0.02, 0]} material={truckMat.paint} />
        </group>
      ))}

      {/* Feux arrière */}
      {[-0.95, 0.95].map((z) => <Block key={z} size={[0.04, 0.14, 0.26]} position={[-3.42, 1.05, z]} material={truckMat.tail} />)}

      {/* Roues : essieu avant + double essieu arrière */}
      {[2.6, -1.3, -2.45].flatMap((x) => [-1.0, 1.0].map((z) => <Wheel key={`${x}${z}`} x={x} z={z} />))}
      {/* Garde-boue */}
      {[2.6, -1.88].map((x, i) => [-1.08, 1.08].map((z) => <Block key={`${x}${z}`} size={[i ? 2.2 : 1.15, 0.06, 0.42]} position={[x, 1.05, z]} material={truckMat.dark} />))}
    </group>
  );
}

/* ───────────── Label holographique (HTML au-dessus du canvas) ───────────── */
function Label({ part, state }: { part: (typeof LABELS)[number]; state: HeroState }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useFrame(() => {
    if (!ref.current) return;
    const o = state.labels;
    ref.current.style.opacity = String(o);
    ref.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
    ref.current.dataset.active = state.hover === part.key ? "1" : "0";
  });
  return (
    <Html position={part.at} center zIndexRange={[20, 10]}>
      <a
        ref={ref}
        href={part.href}
        className="holo3d-label"
        style={{ opacity: 0 }}
        onPointerEnter={() => (state.hover = part.key)}
        onPointerLeave={() => (state.hover = null)}
        aria-label={`${part.label} — voir les produits`}
      >
        <i />
        <span>
          {part.label}
          <small>{part.hint} →</small>
        </span>
      </a>
    </Html>
  );
}

/* ───────────── Assemblage ───────────── */
const PARTS: { key: PartKey; node: ReactNode }[] = [
  { key: "concrete", node: <Concrete /> },
  { key: "tile", node: <Tiles /> },
  { key: "rebar", node: <Rebar /> },
  { key: "steel", node: <Steel /> },
  { key: "electricity", node: <Electricity /> },
  { key: "roof", node: <Roof /> },
  { key: "tools", node: <Tools /> },
];

export function House({ state, mobile }: { state: HeroState; mobile: boolean }) {
  const groups = useRef<Partial<Record<PartKey, THREE.Group>>>({});
  const k = mobile ? 0.55 : 1;

  useFrame((_, dt) => {
    // Position de chaque famille = vecteur de vue éclatée × progression (pilotée par le scroll)
    (Object.keys(groups.current) as PartKey[]).forEach((key) => {
      const g = groups.current[key];
      if (!g) return;
      const e = state.explode[key] * k;
      const [x, y, z] = EXPLODE[key];
      g.position.set(x * e, y * e, z * e);
    });
    // Survol d'un label → la famille correspondante s'illumine
    (Object.keys(PART_MATS) as PartKey[]).forEach((key) => {
      const target = state.hover === key ? 1 : 0;
      PART_MATS[key].forEach((m) => {
        const base = BASE_EMISSIVE.get(m) ?? 0;
        m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, base + target * (key === "electricity" ? 2 : 0.9), 8, dt);
      });
    });
  });

  return (
    <group position={[-1.5, 0, 0]}>
      <Upper />
      <Landscape />
      {PARTS.filter((p) => !mobile || p.key !== "tools").map((p) => (
        <group key={p.key} ref={(g) => { if (g) groups.current[p.key] = g; }}>
          {p.node}
          {LABELS.filter((l) => l.key === p.key && (!mobile || l.mobile)).map((l) => <Label key={l.key} part={l} state={state} />)}
        </group>
      ))}
      {!mobile && <Vehicle />}
    </group>
  );
}
