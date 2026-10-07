/**
 * Header (TDR §8)
 * Ligne 1 : bandeau d'information (graphite).  Ligne 2 : logo · navigation · recherche · WhatsApp · devis.
 * Motion E : au scroll, le bandeau se replie et la barre devient compacte, opaque, avec bordure.
 * Mobile : menu plein écran en drawer, actions principales toujours visibles.
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ClipboardTextIcon, ListIcon, MagnifyingGlassIcon, PhoneIcon, UserCircleIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { NAV, SITE } from "@/lib/site";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Drawer } from "@/components/ui/Drawer";
import { useQuote } from "@/components/quote/QuoteProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { EASE } from "@/components/motion/tokens";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useQuote();
  const search = useSearch();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));
  useEffect(() => setMenu(false), [pathname]);

  // Au-dessus du Hero holographique (fond sombre) tant qu'on n'a pas défilé : header clair
  const onDark = pathname === "/" && !scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2">
        Aller au contenu
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Bandeau d'information */}
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 36 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="hidden overflow-hidden bg-ink text-[12.5px] text-white/70 md:block"
        >
          <div className="shell flex h-9 items-center justify-between">
            <p>Matériaux de construction <span className="mx-2 text-white/25">•</span> Vente détail & gros <span className="mx-2 text-white/25">•</span> Cotonou</p>
            <div className="flex items-center gap-6">
              <a href={SITE.phoneHref} onClick={() => track("phone_click", { from: "topbar" })} className="inline-flex items-center gap-1.5 hover:text-white">
                <PhoneIcon size={14} weight="fill" /> {SITE.phone}
              </a>
              <a href={SITE.clientSpace} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
                <UserCircleIcon size={15} weight="fill" /> Espace client
              </a>
            </div>
          </div>
        </motion.div>

        {/* Barre principale */}
        <div
          className={cn(
            "border-b transition-[background-color,border-color,box-shadow] duration-300",
            scrolled ? "border-line bg-white/90 shadow-[0_8px_30px_-18px_rgb(20_22_26/0.25)] backdrop-blur-xl" : "border-transparent bg-paper/0",
          )}
        >
          <motion.div initial={false} animate={{ height: scrolled ? 64 : 76 }} transition={{ duration: 0.3, ease: EASE }} className="shell flex items-center gap-6">
            <Logo tone={onDark ? "light" : "dark"} />

            <nav aria-label="Navigation principale" className="ml-4 hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn("relative block whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-medium transition-colors", onDark ? (isActive(item.href) ? "text-white" : "text-white/65 hover:text-white") : isActive(item.href) ? "text-ink" : "text-steel hover:text-ink")}
                    >
                      {isActive(item.href) && (
                        <motion.span layoutId="nav-pill" className={cn("absolute inset-0 -z-10 rounded-lg", onDark ? "bg-white/10" : "bg-ink/[0.06]")} transition={{ duration: 0.35, ease: EASE }} />
                      )}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {/* Recherche rapide */}
              <button
                onClick={search.open}
                className={cn("hidden h-10 items-center gap-2.5 rounded-[10px] border pl-3 pr-2 text-sm transition-colors md:flex 2xl:w-56", onDark ? "border-white/15 bg-white/5 text-white/75 hover:border-white/40" : "border-line bg-white text-steel hover:border-ink/30")}
                aria-label="Rechercher un produit"
              >
                <MagnifyingGlassIcon size={18} />
                <span className="hidden 2xl:inline">Rechercher…</span>
                <kbd className={cn("ml-auto hidden rounded-md px-1.5 py-0.5 text-[11px] font-medium 2xl:inline", onDark ? "bg-white/10" : "bg-paper")}>⌘K</kbd>
              </button>
              <button onClick={search.open} className={cn("grid size-10 place-items-center rounded-[10px] md:hidden", onDark ? "text-white" : "text-ink")} aria-label="Rechercher">
                <MagnifyingGlassIcon size={22} />
              </button>

              <a
                href={whatsappGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { from: "header" })}
                className={cn(buttonClass("outline", "sm"), "max-xl:hidden", onDark && "text-white")}
              >
                <WhatsAppIcon size={17} className="text-whatsapp" /> WhatsApp
              </a>
              <ButtonLink href="/devis" size="sm" className="max-sm:hidden">
                Demander un devis
                {count > 0 && <span className="tabular grid size-5 place-items-center rounded-full bg-ink text-[11px] text-white">{count}</span>}
              </ButtonLink>
              <button onClick={() => setMenu(true)} className={cn("grid size-10 place-items-center rounded-[10px] lg:hidden", onDark ? "text-white" : "text-ink")} aria-label="Ouvrir le menu">
                <ListIcon size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Menu mobile — Motion G */}
      <Drawer open={menu} onOpenChange={setMenu} title="Menu" side="right">
        <nav aria-label="Navigation mobile" className="flex h-full flex-col px-5 py-4">
          <ul className="grid gap-1">
            {NAV.map((item, i) => (
              <motion.li key={item.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.04, duration: 0.35, ease: EASE }}>
                <Link
                  href={item.href}
                  className={cn("flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-2xl font-semibold tracking-tight", isActive(item.href) ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-ink/80")}
                >
                  {item.label}
                  <ArrowRightIcon size={18} className="text-steel-2" />
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="mt-auto grid gap-2.5 pt-8">
            <ButtonLink href="/devis" size="lg">Demander un devis</ButtonLink>
            <ButtonLink href={whatsappGeneral()} variant="whatsapp" size="lg"><WhatsAppIcon /> WhatsApp</ButtonLink>
            <div className="mt-3 flex items-center justify-between text-sm text-steel">
              <button onClick={() => { setMenu(false); setOpen(true); }} className="inline-flex items-center gap-1.5"><ClipboardTextIcon size={16} /> Ma sélection ({count})</button>
              <a href={SITE.clientSpace} target="_blank" rel="noopener noreferrer">Espace client</a>
            </div>
          </div>
        </nav>
      </Drawer>
    </>
  );
}
