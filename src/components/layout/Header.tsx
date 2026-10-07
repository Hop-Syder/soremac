/**
 * Header (TDR §8) — Motion E : transparent sur le Hero, puis solide et compact au scroll.
 * Indicateur de page active partagé (layoutId) ; menu mobile en drawer.
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, UserRound } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Drawer } from "@/components/ui/Drawer";
import { useQuote } from "@/components/quote/QuoteProvider";
import { EASE } from "@/components/motion/tokens";

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useQuote();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useEffect(() => setMenu(false), [pathname]);

  const solid = !overHero || scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
        Aller au contenu
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          solid ? "border-b border-line/80 bg-paper/92 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-md" : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Ligne d'information — masquée une fois compact */}
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 34, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn("hidden overflow-hidden text-[12px] lg:block", solid ? "text-steel" : "text-paper/75")}
        >
          <div className="container-x flex h-[34px] items-center justify-between border-b border-current/10">
            <p className="tracking-wide">Matériaux de construction · Vente détail & gros · Cotonou, depuis {SITE.foundedYear}</p>
            <div className="flex items-center gap-5">
              <a href={SITE.phoneHref} onClick={() => track("phone_click", { from: "topbar" })} className="inline-flex items-center gap-1.5 hover:text-accent">
                <Phone size={12} /> {SITE.phone}
              </a>
              <a href={SITE.clientSpace} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
                <UserRound size={12} /> Espace client
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ height: scrolled ? 64 : 80 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="container-x flex items-center justify-between gap-6"
        >
          <Logo tone={solid ? "dark" : "light"} />

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative block px-3.5 py-2 text-[14px] font-medium transition-colors",
                      solid ? "text-ink/75 hover:text-ink" : "text-paper/80 hover:text-paper",
                      isActive(item.href) && (solid ? "text-ink!" : "text-paper!"),
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-active" className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-accent" transition={{ duration: 0.35, ease: EASE }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={whatsappGeneral()}
              variant="outline"
              size="sm"
              className={cn("max-md:hidden", !solid && "text-paper")}
              onClick={() => track("whatsapp_click", { from: "header" })}
            >
              <WhatsAppIcon size={16} className="text-whatsapp" /> WhatsApp
            </ButtonLink>
            <ButtonLink href="/devis" size="sm" className="max-md:hidden">
              Demander un devis
              {count > 0 && <span className="tabular -mr-1 grid size-5 place-items-center rounded-full bg-ink text-[11px] text-paper">{count}</span>}
            </ButtonLink>
            <button
              onClick={() => setMenu(true)}
              className={cn("grid size-11 place-items-center rounded-full lg:hidden", solid ? "text-ink" : "text-paper")}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Menu mobile — Motion G slide-in */}
      <Drawer open={menu} onOpenChange={setMenu} title="Menu" side="left">
        <nav aria-label="Navigation mobile" className="px-5 py-4">
          <ul>
            {NAV.map((item, i) => (
              <motion.li key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: EASE }}>
                <Link
                  href={item.href}
                  className={cn("flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-bold uppercase [font-stretch:85%]", isActive(item.href) ? "text-accent-2" : "text-ink")}
                >
                  {item.label}
                  <span className="tabular text-xs font-medium text-steel">0{i + 1}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <ButtonLink href="/devis" size="lg" onClick={() => setMenu(false)}>Demander un devis</ButtonLink>
            <ButtonLink href={whatsappGeneral()} variant="whatsapp" size="lg"><WhatsAppIcon /> WhatsApp</ButtonLink>
            <button onClick={() => { setMenu(false); setOpen(true); }} className="mt-2 text-left text-sm text-steel">Voir ma sélection ({count})</button>
            <a href={SITE.clientSpace} className="text-sm text-steel" target="_blank" rel="noopener noreferrer">Espace client →</a>
          </div>
        </nav>
      </Drawer>
    </>
  );
}
