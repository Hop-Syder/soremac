/**
 * Grande section de conversion avant le footer (TDR §19) — Motion : subtle scale.
 * @hopsyder
 */
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";
import { EASE } from "@/components/motion/tokens";

export function CtaBand({
  title = "Votre besoin. Notre équipe vous répond.",
  text = "Envoyez-nous votre liste de matériaux ou votre besoin. Notre équipe vous accompagne dans votre demande de devis.",
}: { title?: string; text?: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-paper py-6 md:py-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="container-x"
      >
        <div className="relative overflow-hidden bg-accent px-6 py-14 text-ink sm:px-10 md:px-16 md:py-24">
          {/* Trame technique discrète */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#121314_1px,transparent_1px),linear-gradient(90deg,#121314_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Devis · WhatsApp · {SITE.phone}</p>
              <h2 className="mt-4 text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold uppercase">{title}</h2>
            </div>
            <div>
              <p className="text-lg text-ink/80">{text}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/devis" variant="dark" size="lg">
                  Demander un devis <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </ButtonLink>
                <ButtonLink href={whatsappGeneral()} variant="light" size="lg" onClick={() => track("whatsapp_click", { from: "cta-band" })}>
                  <WhatsAppIcon className="text-whatsapp" /> WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
