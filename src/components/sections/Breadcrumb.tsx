/**
 * Fil d'Ariane accessible + JSON-LD BreadcrumbList.
 * @hopsyder
 */
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/cn";

export interface Crumb { name: string; href: string }

export function Breadcrumb({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-[13px]", tone === "light" ? "text-paper/55" : "text-steel")}>
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} className="opacity-50" />}
            {i === all.length - 1 ? (
              <span aria-current="page" className={tone === "light" ? "text-paper" : "text-ink"}>{c.name}</span>
            ) : (
              <Link href={c.href} className="hover:underline underline-offset-4">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
