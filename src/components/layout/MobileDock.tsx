/**
 * Navigation basse mobile (TDR §42) : Accueil · Produits · Recherche · Devis · Contact
 * + bouton WhatsApp flottant, accessible sans masquer le contenu.
 * Le dock se rétracte au scroll vers le bas et réapparaît au scroll vers le haut.
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ClipboardList, Home, LayoutGrid, MessageSquareText, Search } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function MobileDock() {
  const pathname = usePathname();
  const { count, setOpen } = useQuote();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const d = y - last.current;
    if (Math.abs(d) > 8) setHidden(d > 0 && y > 200);
    last.current = y;
  });

  // Les fiches produit ont leur propre barre d'action collante
  const onProduct = pathname.split("/").filter(Boolean).length === 3 && pathname.startsWith("/produits/");

  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/produits", label: "Produits", icon: LayoutGrid },
    { href: "/produits?recherche=1", label: "Recherche", icon: Search },
  ];
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href.split("?")[0] && !href.includes("?"));

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
        animate={{ y: hidden ? 64 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed bottom-[84px] right-4 z-40 grid size-13 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-ink/25 md:bottom-6 md:right-6 md:size-14"
      >
        <WhatsAppIcon size={24} />
      </motion.a>
      )}

      <motion.nav
        aria-label="Navigation rapide"
        initial={false}
        animate={{ y: hidden || onProduct ? "110%" : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md pb-safe md:hidden"
      >
        <ul className="grid grid-cols-5">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium", active(href) ? "text-ink" : "text-steel")}>
                <Icon size={20} strokeWidth={active(href) ? 2.2 : 1.7} />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={() => setOpen(true)} className="relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium text-steel">
              <ClipboardList size={20} strokeWidth={1.7} />
              Devis
              {count > 0 && (
                <motion.span key={count} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="tabular absolute right-[22%] top-2 grid size-[18px] place-items-center rounded-full bg-accent text-[10px] font-bold text-ink">
                  {count}
                </motion.span>
              )}
            </button>
          </li>
          <li>
            <Link href="/contact" className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium", pathname === "/contact" ? "text-ink" : "text-steel")}>
              <MessageSquareText size={20} strokeWidth={1.7} />
              Contact
            </Link>
          </li>
        </ul>
      </motion.nav>
    </>
  );
}
