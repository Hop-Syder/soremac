"use client";
/**
 * Chef d'orchestre des animations de la page d'accueil (GSAP + ScrollTrigger).
 * Chaque section porte des attributs data-m ; une seule passe les anime :
 *  - words    : titres, mots qui montent hors d'un masque
 *  - count    : compteur 0 → valeur (data-to)
 *  - wipe     : tuile dévoilée par un rideau bas → haut
 *  - parallax : image qui glisse doucement dans son cadre (scrub)
 *  - curtain  : photo découverte de haut en bas
 *  - pop      : icônes qui rebondissent en cascade
 *  - stamp    : sceau qui « tamponne »
 *  - sweep    : reflet lumineux qui traverse une carte
 *  - pin      : épingle qui tombe puis pulse
 *  - steps    : étapes qui s'allument une à une le long d'un fil
 *  - rows     : lignes qui glissent en cascade
 *  - velocity : ruban qui accélère avec la vitesse du scroll
 * Tout est désactivé en prefers-reduced-motion (contenu visible d'emblée).
 * @hopsyder
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const once = (trigger: Element, start = "top 82%") => ({ trigger, start, once: true });

export function HomeMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const $ = <T extends HTMLElement = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root.current);

      $("[data-m='words']").forEach((h) => {
        gsap.from(h.querySelectorAll("[data-w]"), { yPercent: 110, rotate: 4, duration: 0.9, ease: "expo.out", stagger: 0.05, scrollTrigger: once(h, "top 88%") });
      });
      $("[data-m='fade']").forEach((el) => {
        gsap.from(el, { autoAlpha: 0, y: 18, duration: 0.8, ease: "power3.out", delay: 0.2, scrollTrigger: once(el, "top 90%") });
      });

      $("[data-m='count']").forEach((el) => {
        const to = Number(el.dataset.to) || 0;
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", scrollTrigger: once(el, "top 90%"), onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      });

      $("[data-m='wipe']").forEach((el, i) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.1, ease: "expo.inOut", delay: (i % 4) * 0.08, scrollTrigger: once(el, "top 92%") });
      });
      $("[data-m='parallax']").forEach((el) => {
        gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      $("[data-m='curtain']").forEach((el, i) => {
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)", scale: 1.15 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "expo.out", delay: i * 0.12, scrollTrigger: once(el, "top 88%") });
      });

      $("[data-m='pop']").forEach((group) => {
        gsap.from(group.querySelectorAll("[data-pop]"), { scale: 0, rotate: -35, duration: 0.8, ease: "back.out(2.2)", stagger: 0.1, scrollTrigger: once(group, "top 90%") });
      });
      $("[data-m='stamp']").forEach((el, i) => {
        gsap.from(el, { scale: 2.2, rotate: -25, autoAlpha: 0, duration: 0.55, ease: "back.out(3)", delay: 0.25 + i * 0.22, scrollTrigger: once(el) });
      });
      $("[data-m='sweep']").forEach((el) => {
        gsap.fromTo(el, { xPercent: -120 }, { xPercent: 420, duration: 1.8, ease: "power2.inOut", delay: 0.3, scrollTrigger: once(el.parentElement ?? el) });
      });

      $("[data-m='pin']").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: once(el) });
        tl.from(el, { y: -60, autoAlpha: 0, duration: 0.7, ease: "bounce.out" })
          .to(el.querySelector("[data-ring]"), { scale: 2.6, autoAlpha: 0, duration: 1.6, ease: "power1.out", repeat: -1 }, "<0.4");
      });
      $("[data-m='rows']").forEach((group) => {
        gsap.from(group.children, { x: -18, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, scrollTrigger: once(group, "top 90%") });
      });

      $("[data-m='steps']").forEach((ol) => {
        const tl = gsap.timeline({ scrollTrigger: once(ol, "top 78%") });
        tl.fromTo(ol.querySelector("[data-line]"), { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: "none" }, 0);
        ol.querySelectorAll("[data-step]").forEach((li, i) => {
          tl.from(li, { x: 24, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, i * 0.45)
            .fromTo(li.querySelector("[data-dot]"), { backgroundColor: "rgba(255,255,255,0.1)", color: "#f2701d" }, { backgroundColor: "#f2701d", color: "#14161a", duration: 0.3 }, i * 0.45 + 0.25);
        });
      });

      $("[data-m='velocity']").forEach((track) => {
        // Ruban : vitesse de base + boost selon la vitesse du scroll
        const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        const boost = gsap.quickTo(loop, "timeScale", { duration: 0.6, ease: "power3.out" });
        ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", onUpdate: (s) => { boost(1 + Math.min(Math.abs(s.getVelocity()) / 220, 6)); gsap.delayedCall(0.15, () => boost(1)); } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return <div ref={root}>{children}</div>;
}

/** Titre découpé en mots masqués (rendu serveur, aucune mutation du DOM). */
export function SplitWords({ text }: { text: string }) {
  return text.split(" ").map((w, i, all) => (
    <span key={i}>
      <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span data-w className="inline-block">{w}</span>
      </span>
      {i < all.length - 1 ? " " : null}
    </span>
  ));
}
