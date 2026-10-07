/**
 * HERO HOLOGRAPHIQUE — arrière-plan immersif SOREMAC (textes identiques au Hero standard).
 *
 * Scène 3D en CSS (aucun WebGL) : grille néon infinie, barres Fe500 nervurées en rotation,
 * carreaux 60×60 irisés flottants, tubes PVC translucides, poussière lumineuse,
 * faisceau de scan vertical, étiquettes HUD (dont une rotative).
 * Tout est animé à l'infini.
 *
 * Interactivité :
 *  - Desktop (>1024 px) : inclinaison ±15° suivant la souris, parallaxe par profondeur.
 *  - Tablette (768–1024 px) : ±8°.
 *  - Mobile : pas d'inclinaison, scène allégée.
 *  - Bouton « Animations » (pause/lecture, mémorisé) + respect de prefers-reduced-motion.
 * @hopsyder
 */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRightIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import s from "./HeroHolo.module.css";

gsap.registerPlugin(useGSAP);

type V = CSSProperties & Record<`--${string}`, string>;

// Barres de fer : position (%), longueur, diamètre, profondeur, angle, durée, retard
const REBARS = [
  { left: 44, top: 22, l: 52, d: 18, z: 120, rz: -24, dur: 9, delay: 0, mobile: true },
  { left: 52, top: 36, l: 48, d: 14, z: -40, rz: -24, dur: 11, delay: 1.2, mobile: true },
  { left: 40, top: 50, l: 58, d: 20, z: 220, rz: -24, dur: 10, delay: 0.6, mobile: true },
  { left: 60, top: 64, l: 40, d: 12, z: -220, rz: -24, dur: 13, delay: 2, mobile: false },
  { left: 70, top: 14, l: 34, d: 10, z: -320, rz: -24, dur: 14, delay: 0.3, mobile: false },
];
// Carreaux 60×60 : position, taille, profondeur, inclinaisons, teinte de départ
const TILES = [
  { left: 64, top: 30, s: 150, z: 60, rx: 52, rz: 28, hue: 200, dur: 8, delay: 0, mobile: true },
  { left: 78, top: 50, s: 120, z: -120, rx: 40, rz: -18, hue: 300, dur: 10, delay: 1.4, mobile: true },
  { left: 55, top: 62, s: 170, z: 180, rx: 60, rz: 40, hue: 40, dur: 9, delay: 0.7, mobile: true },
  { left: 86, top: 20, s: 90, z: -260, rx: 24, rz: 12, hue: 140, dur: 12, delay: 2.2, mobile: false },
  { left: 72, top: 74, s: 110, z: 40, rx: 70, rz: -30, hue: 250, dur: 11, delay: 3, mobile: false },
];
const PIPES = [
  { left: 58, top: 12, l: 30, z: -380, rz: 16 },
  { left: 76, top: 82, l: 26, z: -300, rz: -12 },
];
const DUST = Array.from({ length: 22 }, (_, i) => ({
  left: 40 + ((i * 37) % 58),
  top: 30 + ((i * 53) % 65),
  dur: 7 + (i % 6),
  delay: (i * 0.7) % 8,
  dx: ((i % 5) - 2) * 25,
}));
const ROTATING = ["SIKA · Adjuvant", "Tôle Bac Alu", "Plomberie PVC"];

export function HeroHolo() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [tag, setTag] = useState(0);
  const [maxTilt, setMaxTilt] = useState(0);

  // Inclinaison suivant la souris (spring = transition fluide ease-out)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20 });
  const sy = useSpring(my, { stiffness: 70, damping: 20 });
  const rotateY = useTransform(sx, (v) => v * maxTilt);
  const rotateX = useTransform(sy, (v) => -v * maxTilt);
  // Parallaxe : les calques proches bougent davantage
  const nearX = useTransform(sx, (v) => v * -26);
  const nearY = useTransform(sy, (v) => v * -18);
  const farX = useTransform(sx, (v) => v * 10);
  const farY = useTransform(sy, (v) => v * 6);

  // Préférence mémorisée + amplitude selon l'écran
  useEffect(() => {
    try { setPaused(localStorage.getItem("soremac.hero.paused") === "1"); } catch {}
    const update = () => {
      const w = window.innerWidth;
      const fine = window.matchMedia("(pointer: fine)").matches;
      setMaxTilt(!fine || w < 768 ? 0 : w <= 1024 ? 8 : 15);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const still = reduce || paused;

  useEffect(() => {
    if (still || !maxTilt) { mx.set(0); my.set(0); return; }
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [still, maxTilt, mx, my]);

  // Étiquette rotative
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setTag((i) => (i + 1) % ROTATING.length), 2800);
    return () => clearInterval(t);
  }, [still]);

  // Entrée du texte (mêmes séquences que le Hero standard)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (ctx.conditions?.reduce) return void gsap.set("[data-hero]", { autoAlpha: 1 });
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-hero='stage']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, 0)
          .fromTo("[data-hero='eyebrow']", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
          .set("[data-hero='line']", { autoAlpha: 1 }, 0.3)
          .fromTo("[data-hero='line'] > span", { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.09 }, 0.3)
          .fromTo("[data-hero='sub']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7)
          .fromTo("[data-hero='cta']", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.82);
      });
    },
    { scope: root },
  );

  const toggle = () => {
    setPaused((p) => {
      try { localStorage.setItem("soremac.hero.paused", p ? "0" : "1"); } catch {}
      return !p;
    });
  };

  return (
    <section ref={root} className={cn(s.hero, still && s.paused)}>
      {/* ───── Scène holographique ───── */}
      <div data-hero="stage" className={cn(s.stage, "hero-init")} aria-hidden>
        <div className={s.horizon} />
        <div className="absolute inset-0 [perspective:700px] [perspective-origin:50%_40%]"><div className={s.floor} /></div>
        <motion.div className={s.world} style={{ rotateX: still ? 0 : rotateX, rotateY: still ? 0 : rotateY }}>

          {/* Calque lointain : tubes PVC, éléments reculés */}
          <motion.div className={s.layer} style={{ x: farX, y: farY }}>
            {PIPES.map((p, i) => (
              <span key={i} className={cn(s.pipe, "max-md:hidden")} style={{ left: `${p.left}%`, top: `${p.top}%`, "--l": `${p.l}%`, "--z": `${p.z}px`, "--rz": `${p.rz}deg` } as V} />
            ))}
          </motion.div>

          {/* Calque principal : barres et carreaux */}
          <motion.div className={s.layer} style={{ x: nearX, y: nearY }}>
            {REBARS.map((r, i) => (
              <div
                key={`r${i}`}
                className={cn(s.rebar, !r.mobile && "max-md:hidden")}
                style={{ left: `${r.left}%`, top: `${r.top}%`, "--l": `${r.l}%`, "--d": `${r.d}px`, "--z": `${r.z}px`, "--rz": `${r.rz}deg`, "--dur": `${r.dur}s`, "--delay": `${r.delay}s` } as V}
              >
                <div className={s.rebarBody} />
              </div>
            ))}
            {TILES.map((t, i) => (
              <div
                key={`t${i}`}
                className={cn(s.tile, !t.mobile && "max-md:hidden")}
                style={{ left: `${t.left}%`, top: `${t.top}%`, "--s": `${t.s}px`, "--z": `${t.z}px`, "--rx": `${t.rx}deg`, "--rz": `${t.rz}deg`, "--hue": `${t.hue}deg`, "--dur": `${t.dur}s`, "--delay": `${t.delay}s` } as V}
              >
                <div className={s.tileTop} />
                <div className={s.tileEdgeX} />
                <div className={s.tileEdgeY} />
              </div>
            ))}
          </motion.div>

          {/* Poussière lumineuse */}
          {DUST.map((d, i) => (
            <span
              key={`d${i}`}
              className={cn(s.dust, i % 2 && "max-md:hidden")}
              style={{ left: `${d.left}%`, top: `${d.top}%`, "--dur": `${d.dur}s`, "--delay": `${d.delay}s`, "--dx": `${d.dx}px` } as V}
            />
          ))}
        </motion.div>
        <div className={s.scan} />
      </div>

      {/* Voile de lisibilité */}
      <div className={cn(s.veil, "max-lg:hidden")} aria-hidden />
      <div className={cn(s.veilMobile, "lg:hidden")} aria-hidden />

      {/* Étiquettes HUD */}
      <span className={cn(s.hud, "bottom-[16%] left-[52%] max-lg:hidden")} aria-hidden>Fe500 · Ø12</span>
      <span className={cn(s.hud, "bottom-[10%] right-[5%] max-md:hidden")} style={{ animationDelay: "1.8s" }} aria-hidden>Carrelage 60×60</span>
      <span className={cn(s.hud, "right-[6%] top-[22%] max-md:right-4 max-md:top-24")} aria-hidden>
        <motion.span key={tag} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">{ROTATING[tag]}</motion.span>
      </span>

      {/* ───── Contenu (textes identiques au Hero standard) ───── */}
      <div className="shell relative z-[2] flex min-h-[100svh] flex-col justify-end pb-24 pt-32 lg:justify-center lg:pb-16 lg:pt-40">
        <div className="max-w-2xl">
          <p data-hero="eyebrow" className="hero-init eyebrow eyebrow-dark">Matériaux de construction · Cotonou</p>

          <h1 className="t-display mt-6 text-white">
            <span data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]"><span className="block">Tout pour construire.</span></span>
            <span data-hero="line" className="hero-init block overflow-hidden pb-[0.06em]"><span className="block text-accent">Un seul partenaire.</span></span>
          </h1>

          <p data-hero="sub" className="hero-init mt-6 max-w-md text-[1.075rem] leading-relaxed text-white/70 md:text-[1.2rem]">
            Matériaux, équipements et conseils pour vos chantiers, depuis 1995.
          </p>

          <div data-hero="cta" className="hero-init mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/produits" variant="light" size="lg">
              Explorer le catalogue <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/devis" size="lg">Demander un devis</ButtonLink>
          </div>
        </div>
      </div>

      {/* Contrôle des animations (accessibilité) */}
      {!reduce && (
        <button
          onClick={toggle}
          className="absolute bottom-6 left-1/2 z-[3] inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-medium text-white/75 backdrop-blur transition-colors hover:text-white max-md:hidden"
          aria-pressed={paused}
        >
          {paused ? <PlayIcon size={14} weight="fill" /> : <PauseIcon size={14} weight="fill" />}
          {paused ? "Activer les animations" : "Désactiver les animations"}
        </button>
      )}
    </section>
  );
}
