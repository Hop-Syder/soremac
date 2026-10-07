/**
 * HERO HOLOGRAPHIQUE — maquette architecturale pilotée par le scroll (textes inchangés).
 *
 * Une seule timeline GSAP + ScrollTrigger, Hero épinglé pendant la séquence :
 *   0  Maison complète (« Voici le projet final »)
 *   1  Maison complète + légère avancée de caméra, lumière accentuée
 *   2  Décomposition ordonnée (toiture ↑, carrelage ←, fer →, acier ↗, béton ↓, câbles ↘, outils ↙)
 *   3  Vue éclatée maximale + labels holographiques
 *   4  Recomposition (fer, acier, béton, câblage, carrelage, toiture, outils)
 *   →  Libération du pin, passage naturel à la section suivante
 *
 * Desktop : parallaxe souris très légère par plans (texte stable).
 * Mobile : maison plus petite, moins de composants/labels, séquence raccourcie.
 * prefers-reduced-motion : maison assemblée, pas de pin, pas de timeline.
 * @hopsyder
 */
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { HouseHologram } from "./hero/HouseHologram";
import { PARTS, type PartKey } from "./hero/geometry";
import s from "./HeroHolo.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Ordre de recomposition demandé (TDR mission §11). */
const REBUILD: PartKey[] = ["rebar", "steel", "concrete", "electricity", "tile", "roof", "tools"];

export function HeroHolo() {
  const root = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const set = () => setMobile(mq.matches);
    set();
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

          // Entrée du texte (identique au Hero standard)
          if (reduce) {
            gsap.set(q("[data-hero]"), { autoAlpha: 1 });
            return;
          }
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .fromTo(q("[data-hero='stage']"), { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, 0)
            .fromTo(q("[data-hero='eyebrow']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
            .set(q("[data-hero='line']"), { autoAlpha: 1 }, 0.3)
            .fromTo(q("[data-hero='line'] > span"), { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.09 }, 0.3)
            .fromTo(q("[data-hero='sub']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7)
            .fromTo(q("[data-hero='cta']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.82);

          /* ───────────── Timeline de scroll unique ───────────── */
          const k = desktop ? 1 : 0.45; // amplitude de la vue éclatée
          const parts = PARTS.filter((p) => desktop || p.mobile);
          const el = (key: string) => q(`[data-part="${key}"]`);
          const lab = (key: string) => q(`[data-label="${key}"]`);
          const scene = q("[data-scene]");
          const halo = q("[data-halo]");
          const bars = q("[data-progress] i");

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=340%" : "+=180%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              onUpdate: (self) => {
                // indicateur 4 étapes
                bars.forEach((b, i) => gsap.set(b, { scaleY: gsap.utils.clamp(0, 1, self.progress * 4 - i) }));
              },
            },
          });

          // Étape 0 — maison complète, immobile
          tl.to({}, { duration: 0.5 });

          // Étape 1 — avancée de caméra, profondeur, lumière (la maison reste assemblée)
          tl.addLabel("enter")
            .to(scene, { scale: desktop ? 1.07 : 1.04, yPercent: -2, duration: 1 }, "enter")
            .to(halo, { opacity: 1, scale: 1.12, duration: 1 }, "enter")
            .to({}, { duration: 0.2 });

          // Étape 2 — début de décomposition + légère rotation de caméra
          tl.addLabel("split");
          parts.forEach((p, i) => {
            tl.to(el(p.key), { x: p.explode[0] * k * 0.55, y: p.explode[1] * k * 0.55, duration: 1 }, `split+=${i * 0.05}`);
          });
          tl.to(scene, { rotation: desktop ? -1.5 : 0, scale: desktop ? 1.02 : 1, duration: 1 }, "split");

          // Étape 3 — vue éclatée maximale + labels
          tl.addLabel("exploded");
          parts.forEach((p) => {
            tl.to(el(p.key), { x: p.explode[0] * k, y: p.explode[1] * k, duration: 1 }, "exploded");
            tl.to(lab(p.key), { x: p.explode[0] * k, y: p.explode[1] * k, duration: 1 }, "exploded");
          });
          tl.to(scene, { scale: desktop ? 0.94 : 0.92, duration: 1 }, "exploded");
          tl.to(parts.map((p) => lab(p.key)).flat(), { opacity: 1, duration: 0.45, stagger: 0.08, ease: "power1.out" }, "exploded+=0.45");
          tl.to({}, { duration: 0.7 }); // temps de lecture

          // Étape 4 — recomposition, dans l'ordre demandé
          tl.addLabel("rebuild");
          tl.to(parts.map((p) => lab(p.key)).flat(), { opacity: 0, duration: 0.3 }, "rebuild");
          REBUILD.filter((key) => parts.some((p) => p.key === key)).forEach((key, i) => {
            tl.to([el(key), lab(key)].flat(), { x: 0, y: 0, duration: 0.7, ease: "power3.inOut" }, `rebuild+=${0.2 + i * 0.16}`);
          });
          tl.to(scene, { scale: 1, rotation: 0, yPercent: 0, duration: 1.2 }, "rebuild+=0.2");
          tl.to(halo, { opacity: 0.75, scale: 1, duration: 1.2 }, "rebuild+=0.2");

          // Fin — maison reconstruite, puis le pin se libère
          tl.to({}, { duration: 0.4 });

          /* ───────────── Parallaxe souris (desktop) ───────────── */
          if (desktop && window.matchMedia("(pointer: fine)").matches) {
            const planes = [
              { sel: "[data-plane='2']", ax: 12, ay: 8 },
              { sel: "[data-plane='3']", ax: 8, ay: 5 },
              { sel: "[data-plane='4']", ax: 10, ay: 6 },
              { sel: "[data-plane='5']", ax: 5, ay: 3 },
            ].map((p) => ({
              ...p,
              qx: gsap.quickTo(q(p.sel), "x", { duration: 0.8, ease: "power3.out" }),
              qy: gsap.quickTo(q(p.sel), "y", { duration: 0.8, ease: "power3.out" }),
            }));
            const onMove = (e: PointerEvent) => {
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              planes.forEach((p) => { p.qx(nx * 2 * p.ax); p.qy(ny * 2 * p.ay); });
            };
            window.addEventListener("pointermove", onMove);
            return () => window.removeEventListener("pointermove", onMove);
          }
        },
      );
    },
    { scope: root, dependencies: [mobile], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={s.hero} aria-label="Présentation SOREMAC">
      {/* Zone gauche : fond très calme */}
      <div className={s.calm} aria-hidden>
        <div className={s.blueprint} />
        <span className={s.beam} style={{ top: "28%" }} />
        <span className={s.beam} style={{ top: "71%", width: "34%", opacity: 0.6 }} />
      </div>

      {/* Zone droite : maquette holographique */}
      <div className={s.sceneWrap}>
        <div data-hero="stage" className="hero-init absolute inset-0">
          <div data-halo className={s.halo} style={{ opacity: 0.75 }} aria-hidden />
          <div data-scene className={s.scene}>
            <HouseHologram mobile={mobile} />
          </div>
        </div>
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
      <div data-progress className={s.progress} aria-hidden>
        {[0, 1, 2, 3].map((i) => <span key={i}><i /></span>)}
      </div>
      <p className={s.scrollHint} aria-hidden>Défiler</p>
    </section>
  );
}
