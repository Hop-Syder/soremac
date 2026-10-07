/**
 * Navigation basse mobile (TDR §42) : Accueil · Produits · Recherche · Devis · Contact,
 * plus WhatsApp flottant. Se rétracte au scroll descendant, revient au scroll montant.
 * Masqué sur les fiches produit (elles ont leur propre barre d'action).
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChatCircleTextIcon, ClipboardTextIcon, HouseIcon, MagnifyingGlassIcon, SquaresFourIcon } from "@phosphor-icons/react/ssr";
import { useQuote } from "@/components/quote/QuoteProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function MobileDock() {
  const pathname = usePathname();
  const { count, setOpen } = useQuote();
  const search = useSearch();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const d = y - last.current;
    if (Math.abs(d) > 8) setHidden(d > 0 && y > 240);
    last.current = y;
  });

  const onProduct = pathname.startsWith("/produits/") && pathname.split("/").filter(Boolean).length === 3;
  const item = (active: boolean) => cn("flex h-[60px] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-ink" : "text-steel");
  const weight = (active: boolean) => (active ? "fill" : "regular") as "fill" | "regular";

  return (
    <>
      {!onProduct && (
        <motion.a
          href={whatsappGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "fab" })}
          aria-label="Discuter avec SOREMAC sur WhatsApp"
          initial={false}
          animate={{ y: hidden ? 72 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed bottom-[84px] right-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.55)] md:bottom-6 md:right-6"
        >
          <WhatsAppIcon size={26} />
        </motion.a>
      )}

      <motion.nav
        aria-label="Navigation rapide"
        initial={false}
        animate={{ y: hidden || onProduct ? "120%" : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-line bg-white/95 shadow-[var(--shadow-lift)] backdrop-blur-xl md:hidden"
      >
        <ul className="grid grid-cols-5">
          <li><Link href="/" className={item(pathname === "/")}><HouseIcon size={22} weight={weight(pathname === "/")} />Accueil</Link></li>
          <li><Link href="/produits" className={item(pathname.startsWith("/produits"))}><SquaresFourIcon size={22} weight={weight(pathname.startsWith("/produits"))} />Produits</Link></li>
          <li><button onClick={search.open} className={item(false)}><MagnifyingGlassIcon size={22} />Recherche</button></li>
          <li>
            <button onClick={() => setOpen(true)} className={cn(item(false), "relative")}>
              <ClipboardTextIcon size={22} />Devis
              {count > 0 && (
                <motion.span key={count} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="tabular absolute right-[22%] top-2 grid size-[18px] place-items-center rounded-full bg-accent text-[10px] font-bold text-ink">
                  {count}
                </motion.span>
              )}
            </button>
          </li>
          <li><Link href="/contact" className={item(pathname === "/contact")}><ChatCircleTextIcon size={22} weight={weight(pathname === "/contact")} />Contact</Link></li>
        </ul>
      </motion.nav>
    </>
  );
}
