"use client";
/**
 * Couche motion du footer cinématique :
 * - filigrane « SOREMAC » qui monte et grandit au scroll (GSAP ScrollTrigger, scrub) ;
 * - boutons magnétiques ([data-magnetic]) avec retour élastique ;
 * - retour en haut fluide (Lenis si présent).
 * Tout est coupé en prefers-reduced-motion et sur pointeur tactile.
 * @hopsyder
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FooterMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Filigrane : monte et grandit pendant que la page « glisse » au-dessus du footer
    const giant = el.querySelector<HTMLElement>("[data-giant]");
    if (giant) {
      gsap.fromTo(giant, { yPercent: 28, scale: 0.86, opacity: 0.35 }, {
        yPercent: 0, scale: 1, opacity: 1, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 1 },
      });
    }

    // Boutons magnétiques — souris uniquement
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cleanups: (() => void)[] = [];
    el.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      const strength = Number(btn.dataset.magnetic) || 0.35;
      const move = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: x * strength, y: y * strength, rotationX: -y * 0.1, rotationY: x * 0.1, scale: 1.04, ease: "power2.out", duration: 0.4 });
      };
      const leave = () => gsap.to(btn, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)", duration: 1.2 });
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      cleanups.push(() => { btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", leave); });
    });
    return () => cleanups.forEach((c) => c());
  }, { scope: root });

  return <div ref={root} className={className}>{children}</div>;
}

export function BackToTop() {
  return (
    <button
      type="button"
      data-magnetic="0.45"
      aria-label="Revenir en haut de la page"
      onClick={() => {
        const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors hover:border-accent hover:bg-accent"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
