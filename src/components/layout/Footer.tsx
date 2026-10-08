/**
 * Footer cinématique SOREMAC — effet rideau : la page (main) glisse vers le haut et
 * dévoile le footer resté fixe en dessous (desktop assez haut uniquement, cf. .footer-curtain).
 * Scène : halo chantier qui respire, filigrane « SOREMAC », ruban des familles de
 * matériaux, CTA magnétiques (devis / WhatsApp), puis infos utiles (SEO local, légal).
 * @hopsyder
 */
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { SITE } from "@/lib/site";
import { getCatalog } from "@/lib/catalog/repo";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { BackToTop, FooterMotion } from "./footer/FooterMotion";

const company = [
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/conseils", label: "Conseils" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const { categories } = await getCatalog();
  // Ruban : les vraies familles du catalogue, doublées pour une boucle sans à-coup
  const ribbon = categories.map((c) => c.shortName);

  return (
    <div className="footer-curtain">
      <footer className="footer-stage bg-ink text-white/65">
        <FooterMotion className="relative flex min-h-full flex-col overflow-hidden">
          {/* Ambiance : halo orange chantier + trame de plan */}
          <div aria-hidden className="footer-aurora" />
          <div aria-hidden className="footer-grid" />

          {/* Filigrane */}
          <p aria-hidden data-giant className="footer-giant">SOREMAC</p>

          {/* Scène centrale */}
          <div className="shell relative z-10 flex flex-1 flex-col items-center justify-center pb-10 pt-24 text-center lg:pt-28">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">Depuis 1995 · Cotonou</p>
            <h2 className="footer-title mt-5 max-w-4xl text-balance text-[clamp(2.4rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
              Votre chantier commence ici.
            </h2>
            <p className="footer-sub mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-white/60">
              Dites-nous ce que vous construisez : nous préparons la liste, les quantités et un devis sous 24 h.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3" style={{ perspective: 600 }}>
              <Link href="/devis" data-magnetic className="footer-cta-primary inline-flex h-13 items-center gap-2.5 rounded-full px-7 text-[15px] font-semibold text-white">
                Demander un devis <ArrowRightIcon size={18} weight="bold" />
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" data-magnetic className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-7 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:border-whatsapp hover:bg-whatsapp/15">
                <WhatsAppIcon size={18} /> Écrire sur WhatsApp
              </a>
            </div>
          </div>

          {/* Ruban des matériaux */}
          <div className="footer-ribbon relative z-10" aria-label="Nos familles de produits">
            <div className="footer-ribbon-track">
              {[0, 1].map((k) => (
                <ul key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
                  {ribbon.map((r) => (
                    <li key={r} className="flex items-center whitespace-nowrap px-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      {r}<span aria-hidden className="ml-12 size-1.5 rotate-45 bg-accent" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Infos utiles */}
          <div className="shell relative z-10 pb-28 pt-12 md:pb-8">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Logo tone="light" />
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed">Matériaux de construction, équipements et solutions pour vos projets au Bénin.</p>
                <a href={SITE.clientSpace} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-sm font-medium text-white hover:bg-white/5">Espace client</a>
              </div>
              <Col title="Entreprise" className="lg:col-span-2">
                {company.map((l) => <li key={l.href}><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>)}
              </Col>
              <Col title="Produits" className="lg:col-span-3" listClass="grid-cols-2 gap-x-6">
                {categories.slice(0, 8).map((c) => <li key={c.slug}><Link href={`/produits/${c.slug}`} className="transition-colors hover:text-white">{c.shortName}</Link></li>)}
              </Col>
              <Col title="Contact" className="lg:col-span-3">
                <li className="flex gap-3"><PhoneIcon size={18} className="mt-0.5 shrink-0 text-accent" /><a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a></li>
                <li className="flex gap-3"><EnvelopeSimpleIcon size={18} className="mt-0.5 shrink-0 text-accent" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
                <li className="flex gap-3"><MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" /><span>{SITE.address.district} — {SITE.address.quarter}, {SITE.address.city}</span></li>
                <li className="flex gap-3"><ClockIcon size={18} className="mt-0.5 shrink-0 text-accent" /><span>Lun–Ven 08h–13h · 15h–18h · Sam 08h–13h</span></li>
              </Col>
            </div>

            <div className="mt-10 flex items-center justify-between gap-6 border-t border-white/10 pt-6 text-[12px] uppercase tracking-[0.14em] text-white/40">
              <p>© {new Date().getFullYear()} {SITE.name} · RCCM {SITE.legal.rccm} · IFU {SITE.legal.ifu}</p>
              <div className="flex items-center gap-6">
                <Link href="/mentions-legales" className="hidden hover:text-white sm:inline">Mentions légales</Link>
                <Link href="/confidentialite" className="hidden hover:text-white sm:inline">Confidentialité</Link>
                <BackToTop />
              </div>
            </div>
          </div>
        </FooterMotion>
      </footer>
    </div>
  );
}

function Col({ title, children, className, listClass = "" }: { title: string; children: React.ReactNode; className?: string; listClass?: string }) {
  return (
    <div className={className}>
      <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      <ul className={`grid gap-2.5 text-[15px] ${listClass}`}>{children}</ul>
    </div>
  );
}
