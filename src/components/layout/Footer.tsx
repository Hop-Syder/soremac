/**
 * Footer (TDR §20) — dense mais aéré : marque, entreprise, produits, contact, mentions légales.
 * @hopsyder
 */
import Link from "next/link";
import { ClockIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { SITE } from "@/lib/site";
import { getCatalog } from "@/lib/catalog/repo";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "@/components/ui/icons";

const company = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/conseils", label: "Conseils" },
  { href: "/contact", label: "Contact" },
  { href: "/devis", label: "Demander un devis" },
];

export async function Footer() {
  const { categories } = await getCatalog();
  return (
    <footer className="bg-ink pb-28 pt-20 text-white/65 md:pb-10">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed">Matériaux de construction, équipements et solutions pour vos projets au Bénin.</p>
            <div className="mt-6 flex gap-2">
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-whatsapp px-4 text-sm font-semibold text-white"><WhatsAppIcon size={16} /> WhatsApp</a>
              <a href={SITE.clientSpace} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-[10px] border border-white/15 px-4 text-sm font-medium text-white hover:bg-white/5">Espace client</a>
            </div>
          </div>

          <Col title="Entreprise" className="lg:col-span-2">
            {company.map((l) => <li key={l.href}><Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link></li>)}
          </Col>

          <Col title="Produits" className="lg:col-span-3" listClass="grid-cols-2 gap-x-6">
            {categories.slice(0, 10).map((c) => <li key={c.slug}><Link href={`/produits/${c.slug}`} className="transition-colors hover:text-white">{c.shortName}</Link></li>)}
          </Col>

          <Col title="Contact" className="lg:col-span-3">
            <li className="flex gap-3"><PhoneIcon size={18} className="mt-0.5 shrink-0 text-accent" /><a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a></li>
            <li className="flex gap-3"><EnvelopeSimpleIcon size={18} className="mt-0.5 shrink-0 text-accent" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li className="flex gap-3"><MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" /><span>{SITE.address.district} — {SITE.address.quarter}<br />{SITE.address.plot}, {SITE.address.city}</span></li>
            <li className="flex gap-3"><ClockIcon size={18} className="mt-0.5 shrink-0 text-accent" /><span>Lun–Ven 08h–13h · 15h–18h<br />Sam 08h–13h</span></li>
          </Col>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name} · RCCM {SITE.legal.rccm} · IFU {SITE.legal.ifu} · Capital {SITE.legal.capital}</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children, className, listClass = "" }: { title: string; children: React.ReactNode; className?: string; listClass?: string }) {
  return (
    <div className={className}>
      <p className="mb-5 text-sm font-semibold text-white">{title}</p>
      <ul className={`grid gap-3 text-[15px] ${listClass}`}>{children}</ul>
    </div>
  );
}
