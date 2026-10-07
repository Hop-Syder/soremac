/**
 * Footer dense et élégant (TDR §20) — NAP + mentions légales officielles.
 * @hopsyder
 */
import Link from "next/link";
import { SITE } from "@/lib/site";
import { getCatalog } from "@/lib/catalog/repo";
import { Logo } from "./Logo";
import { Reveal } from "@/components/motion/Reveal";

const company = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/conseils", label: "Conseils" },
  { href: "/contact", label: "Contact" },
  { href: SITE.clientSpace, label: "Espace client" },
];

export async function Footer() {
  const { categories } = await getCatalog();
  return (
    <footer className="bg-ink pb-24 pt-16 text-paper/70 md:pb-10 md:pt-20">
      <Reveal className="container-x">
        <div className="grid gap-12 border-b border-paper/10 pb-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed">
              Matériaux de construction, équipements et solutions pour vos projets au Bénin.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-paper/40">Depuis {SITE.foundedYear} · Cotonou</p>
          </div>
          <FooterCol title="Entreprise" className="md:col-span-2">
            {company.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-accent">{l.label}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title="Produits" className="md:col-span-3" listClass="grid-cols-2 gap-x-6 md:grid-cols-1">
            {categories.slice(0, 10).map((c) => (
              <li key={c.slug}><Link href={`/produits/${c.slug}`} className="hover:text-accent">{c.name}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title="Contact" className="md:col-span-3">
            <li><a href={SITE.phoneHref} className="hover:text-accent">Tél. {SITE.phone}</a></li>
            <li><a href={`https://wa.me/${SITE.whatsapp}`} className="hover:text-accent">WhatsApp {SITE.whatsappDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a></li>
            <li className="pt-2 leading-relaxed">
              {SITE.address.district} — Quartier {SITE.address.quarter}<br />
              {SITE.address.landmark}<br />
              {SITE.address.plot}, {SITE.address.city}, {SITE.address.country}
            </li>
          </FooterCol>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} · RCCM {SITE.legal.rccm} · IFU {SITE.legal.ifu} · Capital {SITE.legal.capital}
          </p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="hover:text-paper">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-paper">Confidentialité</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

function FooterCol({ title, children, className, listClass = "" }: { title: string; children: React.ReactNode; className?: string; listClass?: string }) {
  return (
    <div className={className}>
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">{title}</p>
      <ul className={`grid gap-2.5 text-[14.5px] ${listClass}`}>{children}</ul>
    </div>
  );
}
