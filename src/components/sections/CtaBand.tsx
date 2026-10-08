/**
 * Section de conversion avant le footer (TDR §19) — Motion : léger scale d'entrée.
 * Panneau graphite + liste de 3 étapes : ce qui se passe après la demande.
 * @hopsyder
 */
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, ClipboardTextIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";
import { EASE } from "@/components/motion/tokens";

const steps = [
  "Envoyez votre liste ou vos plans",
  "Nous vérifions disponibilité et quantités",
  "Vous recevez votre devis, livraison possible",
];

export function CtaBand({
  title = "Votre besoin. Notre équipe vous répond.",
  text = "Envoyez-nous votre liste de matériaux ou votre besoin. Notre équipe vous accompagne dans votre demande de devis.",
}: { title?: string; text?: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="section pt-0">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.975, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="shell"
      >
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-white sm:px-12 md:py-20 lg:px-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-accent/25 blur-[100px]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-[clamp(2.2rem,4.8vw,4rem)] font-bold leading-[1.02] tracking-[-0.04em]">{title}</h2>
              <p className="mt-5 max-w-xl text-lg text-white/65">{text}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/devis" size="lg">
                  Demander un devis <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover/btn:translate-x-1" />
                </ButtonLink>
                <ButtonLink href={whatsappGeneral()} variant="whatsapp" size="lg" onClick={() => track("whatsapp_click", { from: "cta-band" })}>
                  <WhatsAppIcon /> WhatsApp
                </ButtonLink>
              </div>
            </div>
            <ol data-m="steps" className="relative grid gap-3">
              <span data-line aria-hidden className="absolute bottom-[4.5rem] left-[2.25rem] top-9 w-px origin-top bg-accent/60" />
              {steps.map((s, i) => (
                <li key={s} data-step className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span data-dot className="tabular grid size-10 shrink-0 place-items-center rounded-full bg-white/10 font-display font-bold text-accent">{i + 1}</span>
                  <span className="text-[15px] text-white/85">{s}</span>
                </li>
              ))}
              <li className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-white/55">
                <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-white"><PhoneIcon size={16} /> {SITE.phone}</a>
                <span className="inline-flex items-center gap-2"><ClipboardTextIcon size={16} /> Détail & gros</span>
              </li>
            </ol>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
