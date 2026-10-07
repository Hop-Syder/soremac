/**
 * Fil d'Ariane accessible + JSON-LD BreadcrumbList.
 * @hopsyder
 */
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

export interface Crumb { name: string; href: string }

export function Breadcrumb({ items }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-[13.5px] text-steel">
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <CaretRightIcon size={12} className="text-steel-2" />}
            {i === all.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink">{c.name}</span>
            ) : (
              <Link href={c.href} className="transition-colors hover:text-ink">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
