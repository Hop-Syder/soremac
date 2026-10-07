/**
 * /contact — extrêmement simple (TDR §38) : canaux directs à gauche, formulaire à droite,
 * puis carte, adresse complète et horaires.
 * @hopsyder
 */
import type { Metadata } from "next";
import { ArrowUpRightIcon, EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { PageHero } from "@/components/sections/PageHero";
import { Location } from "@/components/home/Location";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ContactForm } from "./ContactForm";
import { SITE } from "@/lib/site";
import { whatsappGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact — SOREMAC Vedoko, Cotonou",
  description: `Contactez SOREMAC : ${SITE.phone}, WhatsApp, email. ${SITE.address.district}, ${SITE.address.quarter}, Cotonou. Horaires et plan d'accès.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { icon: PhoneIcon, label: "Téléphone", value: SITE.phone, href: SITE.phoneHref, hint: "Aux heures d'ouverture" },
    { icon: WhatsAppIcon, label: "WhatsApp", value: SITE.whatsappDisplay, href: whatsappGeneral(), hint: "Le plus rapide pour un devis" },
    { icon: EnvelopeSimpleIcon, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, hint: "Pour vos listes et plans" },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre projet." intro="Une question, une liste de matériaux, un devis : choisissez le canal qui vous convient." crumbs={[{ name: "Contact", href: "/contact" }]} />
      <section className="section">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          <Reveal className="grid content-start gap-3">
            {channels.map(({ icon: Icon, label, value, href, hint }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-5 rounded-[20px] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-2"><Icon size={26} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-steel">{label} · {hint}</span>
                  <span className="tabular block truncate text-lg font-semibold">{value}</span>
                </span>
                <ArrowUpRightIcon size={18} className="shrink-0 text-steel-2 transition-colors group-hover:text-ink" />
              </a>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="rounded-[24px] border border-line bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
            <h2 className="t-h3">Envoyer un message</h2>
            <p className="mt-1 text-steel">Réponse rapide par téléphone ou WhatsApp.</p>
            <div className="mt-7"><ContactForm /></div>
          </Reveal>
        </div>
      </section>
      <section className="pb-[var(--section-y)]">
        <div className="shell"><Location /></div>
      </section>
    </>
  );
}
