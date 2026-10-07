/**
 * Navigation du back-office : barre latérale (desktop), barre horizontale défilante (mobile).
 * @hopsyder
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Package } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/devis", label: "Demandes", icon: Inbox },
];

export function AdminNav({ newQuotes }: { newQuotes: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav aria-label="Back-office" className="flex gap-1 overflow-x-auto px-3 py-2 lg:flex-col lg:overflow-visible lg:px-3 lg:py-4">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={active(href) ? "page" : undefined}
          className={cn(
            "relative flex shrink-0 items-center gap-3 rounded-[3px] px-3 py-2.5 text-sm font-medium transition-colors",
            active(href) ? "text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper",
          )}
        >
          {active(href) && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-[3px] bg-paper/10" transition={{ duration: 0.3, ease: EASE }} />}
          <Icon size={17} className="relative" />
          <span className="relative">{label}</span>
          {href === "/admin/devis" && newQuotes > 0 && (
            <span className="tabular relative ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-ink">{newQuotes}</span>
          )}
        </Link>
      ))}
      <div className="hidden lg:mt-6 lg:block lg:border-t lg:border-paper/10 lg:pt-4" />
      <a href="/" target="_blank" className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm text-paper/60 hover:text-paper">
        <ExternalLink size={17} /> Voir le site
      </a>
      <form action={logout}>
        <button className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm text-paper/60 hover:text-paper">
          <LogOut size={17} /> Déconnexion
        </button>
      </form>
    </nav>
  );
}
