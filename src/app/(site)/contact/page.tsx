/**
 * /contact — extrêmement simple (TDR §38).
 * @hopsyder
 */
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
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
    { icon: Phone, label: "Téléphone", value: SITE.phone, href: SITE.phoneHref },
    { icon: WhatsAppIcon, label: "WhatsApp", value: SITE.whatsappDisplay, href: whatsappGeneral() },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre projet." crumbs={[{ name: "Contact", href: "/contact" }]} />
      <section className="py-14 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <Reveal>
            <ul className="grid gap-px bg-line">
              {channels.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-5 bg-paper py-6 transition-colors hover:bg-white sm:px-6">
                    <Icon size={22} className="text-accent-2" />
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-steel">{label}</span>
                      <span className="tabular text-xl font-semibold group-hover:underline group-hover:underline-offset-4">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.18em] text-steel">Horaires</p>
              <ul className="mt-3 grid gap-1.5">
                {SITE.hours.map((h) => <li key={h.days} className="flex justify-between gap-4 border-b border-line pb-1.5"><span>{h.days}</span><span className="tabular text-steel">{h.slots}</span></li>)}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="bg-white p-6 md:p-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
      <section className="grid lg:grid-cols-[1fr_2fr]">
        <div className="bg-ink p-8 text-paper md:p-12">
          <MapPin className="text-accent" />
          <p className="mt-4 font-display text-3xl font-bold uppercase">{SITE.address.district} — {SITE.address.quarter}</p>
          <p className="mt-3 text-paper/70">{SITE.address.landmark}<br />{SITE.address.plot}, {SITE.address.city}, {SITE.address.country}</p>
          <ButtonLink href={SITE.mapsUrl} className="mt-8">Ouvrir dans Google Maps</ButtonLink>
        </div>
        <iframe title="Carte — SOREMAC" src={SITE.mapsEmbed} loading="lazy" className="h-[380px] w-full grayscale-[0.6] lg:h-full" referrerPolicy="no-referrer-when-downgrade" />
      </section>
    </>
  );
}
