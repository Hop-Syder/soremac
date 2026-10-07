/**
 * HERO HOLOGRAPHIQUE — maquette architecturale pilotée par le scroll (textes inchangés).
 *
 * Scène 3D React Three Fiber (maison modélisée en code) + une seule timeline GSAP/ScrollTrigger
 * qui écrit dans un état partagé lu à chaque frame par la scène. Hero épinglé pendant la séquence :
 *   0  Maison complète (« Voici le projet final »)
 *   1  Maison complète + légère avancée de caméra, lumière accentuée
 *   2  Décomposition ordonnée (toiture ↑, carrelage ←, fer →, acier ↗, béton ↓, câbles ↘, outils ↙)
 *   3  Vue éclatée maximale + labels holographiques
 *   4  Recomposition (fer, acier, béton, câblage, carrelage, toiture, outils)
 *   →  Libération du pin, passage naturel à la section suivante
 *
 * Desktop : parallaxe souris très légère par plans (texte stable).
 * Mobile : maison plus petite, moins de composants/labels, séquence raccourcie.
 * prefers-reduced-motion ou WebGL indisponible : maquette SVG statique assemblée, ni pin ni timeline.
 * La maquette SVG sert aussi d'image d'attente pendant le chargement de la 3D.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowClockwiseIcon, ArrowRightIcon, CaretLeftIcon, CaretRightIcon, CubeFocusIcon, HandGrabbingIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { HouseHologram } from "./hero/HouseHologram";
import { createHeroState, type PartKey } from "./hero3d/state";
import s from "./HeroHolo.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// La 3D (three + R3F) est chargée après le texte, côté client uniquement
const Scene = dynamic(() => import("./hero3d/Scene"), { ssr: false });

/** Ordre de décomposition et de recomposition (mission §11). */
const ORDER: PartKey[] = ["rebar", "steel", "concrete", "electricity", "tile", "roof", "tools"];

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export function HeroHolo() {
  const root = useRef<HTMLElement>(null);
  const state = useMemo(createHeroState, []);
  const [mobile, setMobile] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [auto, setAuto] = useState(false);
  const drag = useRef<{ x: number; active: boolean } | null>(null);

  /* ───── Rotation 360° : flèches, rotation auto, glisser (souris / tactile) ───── */
  const rotate = (dir: 1 | -1) => {
    state.auto = false;
    setAuto(false);
    gsap.to(state, { yaw: state.yaw + dir * (Math.PI / 4), duration: 0.9, ease: "power3.inOut", overwrite: "auto" });
  };
  const toggleAuto = () => {
    gsap.killTweensOf(state, "yaw");
    state.auto = !state.auto;
    setAuto(state.auto);
  };
  const recenter = () => {
    state.auto = false;
    setAuto(false);
    // retour à l'angle d'origine par le chemin le plus court
    const turn = Math.PI * 2;
    const target = Math.round(state.yaw / turn) * turn;
    gsap.to(state, { yaw: target, duration: 1.1, ease: "power3.inOut", overwrite: "auto" });
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    drag.current = { x: e.clientX, active: true };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    gsap.killTweensOf(state, "yaw");
    state.auto = false;
    setAuto(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current?.active) return;
    const dx = e.clientX - drag.current.x;
    drag.current.x = e.clientX;
    state.yaw -= dx * 0.009;
  };
  const endDrag = () => { if (drag.current) drag.current.active = false; };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = () => setMobile(mq.matches);
    set();
    setUse3D(!reduce && hasWebGL());
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions!;
          if (reduce) {
            gsap.set(q("[data-hero]"), { autoAlpha: 1 });
            return;
          }

          // Entrée du texte (identique)
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .fromTo(q("[data-hero='stage']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, 0)
            .fromTo(q("[data-hero='eyebrow']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
            .set(q("[data-hero='line']"), { autoAlpha: 1 }, 0.3)
            .fromTo(q("[data-hero='line'] > span"), { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.09 }, 0.3)
            .fromTo(q("[data-hero='sub']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7)
            .fromTo(q("[data-hero='cta']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.82);

          if (!use3D) return;

          /* ───────────── Timeline de scroll unique (écrit dans l'état 3D) ───────────── */
          const bars = q("[data-progress] i");
          const ex = state.explode;
          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=340%" : "+=200%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              onUpdate: (self) => bars.forEach((b, i) => gsap.set(b, { scaleY: gsap.utils.clamp(0, 1, self.progress * 4 - i) })),
            },
          });

          // 0 — maison complète
          tl.to({}, { duration: 0.5 });
          // 1 — avancée de caméra, profondeur, lumière (maison assemblée)
          tl.to(state, { dolly: 1, glow: 1, duration: 1 }).to({}, { duration: 0.2 });
          // 2 — décomposition ordonnée + légère rotation
          tl.addLabel("split");
          ORDER.forEach((k, i) => tl.to(ex, { [k]: 0.55, duration: 1 }, `split+=${i * 0.06}`));
          tl.to(state, { orbit: desktop ? 0.22 : 0.12, duration: 1.2 }, "split");
          // 3 — vue éclatée maximale + labels
          tl.addLabel("exploded");
          tl.to(ex, { roof: 1, tile: 1, rebar: 1, steel: 1, concrete: 1, electricity: 1, tools: 1, duration: 1 }, "exploded");
          tl.to(state, { pullback: 1, dolly: 0.4, duration: 1 }, "exploded");
          tl.to(state, { labels: 1, duration: 0.5, ease: "power1.out" }, "exploded+=0.55");
          tl.to({}, { duration: 0.7 });
          // 4 — recomposition : fer, acier, béton, câblage, carrelage, toiture, outils
          tl.addLabel("rebuild");
          tl.to(state, { labels: 0, duration: 0.3 }, "rebuild");
          ORDER.forEach((k, i) => tl.to(ex, { [k]: 0, duration: 0.7, ease: "power3.inOut" }, `rebuild+=${0.2 + i * 0.16}`));
          tl.to(state, { orbit: 0, pullback: 0, dolly: 0, glow: 0.3, duration: 1.3 }, "rebuild+=0.2");
          // fin — le pin se libère
          tl.to({}, { duration: 0.4 });

          // Parallaxe souris très légère (desktop, texte stable)
          if (desktop && window.matchMedia("(pointer: fine)").matches) {
            const onMove = (e: PointerEvent) => {
              gsap.to(state.mouse, { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1, duration: 0.8, ease: "power3.out", overwrite: true });
            };
            window.addEventListener("pointermove", onMove);
            return () => window.removeEventListener("pointermove", onMove);
          }
        },
      );
    },
    { scope: root, dependencies: [mobile, use3D], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={s.hero} aria-label="Présentation SOREMAC">
      {/* Zone gauche : fond très calme */}
      <div className={s.calm} aria-hidden>
        <div className={s.blueprint} />
        <span className={s.beam} style={{ top: "28%" }} />
        <span className={s.beam} style={{ top: "71%", width: "34%", opacity: 0.6 }} />
      </div>

      {/* Zone droite : maquette 3D (SVG en attente / repli) */}
      <div
        className={s.sceneWrap}
        onPointerDown={use3D ? onPointerDown : undefined}
        onPointerMove={use3D ? onPointerMove : undefined}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        style={use3D ? { cursor: "grab", touchAction: "pan-y" } : undefined}
      >
        <div data-hero="stage" className="hero-init absolute inset-0">
          <div className={s.halo} aria-hidden />
          <div className={s.poster} style={{ opacity: use3D && ready ? 0 : 1 }}>
            <div className={s.scene}><HouseHologram mobile={mobile} /></div>
          </div>
          {use3D && (
            <div className={s.canvas} style={{ opacity: ready ? 1 : 0 }}>
              <Scene state={state} mobile={mobile} onReady={() => setReady(true)} />
            </div>
          )}
        </div>

        {use3D && ready && (
          <>
            {/* Badge : la maquette est un outil de présentation, pas une image */}
            <div className={s.badge}>
              <CubeFocusIcon size={16} weight="duotone" />
              <span>Maquette 3D interactive</span>
              <em>Les matériaux SOREMAC, assemblés comme sur votre chantier</em>
            </div>

            {/* Contrôles 360° */}
            <div className={s.controls}>
              <div className="holo360" role="group" aria-label="Rotation de la maquette">
                <button onClick={() => rotate(-1)} aria-label="Tourner vers la gauche" className="max-lg:hidden"><CaretLeftIcon size={16} weight="bold" /></button>
                <button onClick={toggleAuto} aria-pressed={auto} aria-label={auto ? "Arrêter la rotation 360°" : "Lancer la rotation 360°"}>
                  <ArrowClockwiseIcon size={15} weight="bold" className={auto ? "animate-spin [animation-duration:3s]" : ""} /> 360°
                </button>
                <button onClick={() => rotate(1)} aria-label="Tourner vers la droite" className="max-lg:hidden"><CaretRightIcon size={16} weight="bold" /></button>
                <button onClick={recenter} aria-label="Revenir à la vue de face" className="max-lg:hidden">Face</button>
              </div>
              <p className={s.dragHint}><HandGrabbingIcon size={15} /> Glissez pour tourner</p>
            </div>
          </>
        )}
      </div>

      {/* Contenu (textes identiques) */}
      <div className={`${s.content} shell pointer-events-none flex flex-col justify-end pb-16 pt-32 lg:justify-center lg:pb-10 lg:pt-36`}>
        <div className="pointer-events-auto max-w-xl lg:w-[46%] lg:max-w-none">
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

      {/* Progression de la séquence (desktop) */}
      {use3D && (
        <>
          <div data-progress className={s.progress} aria-hidden>
            {[0, 1, 2, 3].map((i) => <span key={i}><i /></span>)}
          </div>
          <p className={s.scrollHint} aria-hidden>Défiler</p>
        </>
      )}
    </section>
  );
}
