/**
 * Visuel du Hero : matériaux « holographiques » en 3D CSS (aucun WebGL, aucune image).
 * Scène isométrique : grille lumineuse au sol, carreaux irisés qui flottent, barres de fer
 * à béton nervurées, faisceau de scan. Inclinaison qui suit la souris (desktop).
 * prefers-reduced-motion : scène figée, toujours lisible.
 * @hopsyder
 */
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

// Carreaux : position dans une grille 3×3, hauteur de flottaison, retard d'animation
const TILES = [
  { x: 0, y: 0, z: 18, d: 0 }, { x: 1, y: 0, z: 46, d: 0.6 }, { x: 2, y: 0, z: 24, d: 1.2 },
  { x: 0, y: 1, z: 58, d: 1.8 }, { x: 1, y: 1, z: 30, d: 0.3 }, { x: 2, y: 1, z: 70, d: 0.9 },
  { x: 0, y: 2, z: 28, d: 1.5 }, { x: 1, y: 2, z: 62, d: 2.1 }, { x: 2, y: 2, z: 36, d: 2.7 },
];
// Barres de fer : décalage, hauteur, diamètre relatif
const BARS = [
  { y: 8, z: 128, w: 15, d: 0 },
  { y: 30, z: 150, w: 19, d: 0.5 },
  { y: 52, z: 136, w: 13, d: 1 },
  { y: 74, z: 164, w: 17, d: 1.5 },
];

export function HoloMaterials() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotX = useTransform(sy, [-1, 1], [62, 50]);
  const rotZ = useTransform(sx, [-1, 1], [-46, -30]);

  useEffect(() => {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <div className="holo relative mx-auto aspect-square w-full max-w-[600px] select-none" aria-hidden>
      {/* Halo */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(242_112_29/0.28),rgb(56_189_248/0.14)_45%,transparent_70%)] blur-2xl" />

      <div className="absolute inset-0 [perspective:1400px]">
        <motion.div
          className="absolute left-1/2 top-1/2 size-[64%] [transform-style:preserve-3d]"
          style={{ x: "-50%", y: "-46%", rotateX: reduce ? 56 : rotX, rotateZ: reduce ? -38 : rotZ }}
        >
          {/* Grille holographique au sol */}
          <div className="holo-grid absolute -inset-[30%] [transform:translateZ(-40px)]" />

          {/* Carreaux irisés */}
          {TILES.map((t, i) => (
            <div
              key={i}
              className="holo-float absolute [transform-style:preserve-3d]"
              style={{
                left: `${t.x * 34}%`,
                top: `${t.y * 34}%`,
                width: "31%",
                height: "31%",
                ["--z" as string]: `${t.z}px`,
                animationDelay: `${t.d}s`,
              }}
            >
              <div className="holo-tile absolute inset-0 rounded-[10px]" />
              {/* tranche du carreau */}
              <div className="holo-edge absolute inset-x-0 bottom-0 h-[10px] origin-bottom rounded-b-[6px] [transform:rotateX(-90deg)]" />
            </div>
          ))}

          {/* Barres de fer à béton nervurées */}
          {BARS.map((b, i) => (
            <div
              key={i}
              className="holo-float absolute -left-[22%] [transform-style:preserve-3d]"
              style={{ top: `${b.y}%`, width: "144%", height: `${b.w}px`, ["--z" as string]: `${b.z}px`, animationDelay: `${b.d}s`, animationDuration: "7s" }}
            >
              <div className="holo-bar absolute inset-0 rounded-full" />
              <div className="absolute inset-0 rounded-full [transform:translateZ(-60px)] bg-ink/25 blur-md" />
            </div>
          ))}

          {/* Faisceau de scan */}
          <div className="holo-scan absolute -inset-[20%] [transform:translateZ(90px)]" />
        </motion.div>
      </div>

      {/* Étiquettes techniques (courtes) */}
      <span className="holo-tag absolute right-[6%] top-[16%]">Fe500 · Ø12</span>
      <span className="holo-tag absolute bottom-[14%] left-[4%]">Carrelage 60×60</span>
    </div>
  );
}
