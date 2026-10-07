/** Actions rapides d'une ligne produit : « À la une », « Populaire », publier / archiver. @hopsyder */
"use client";

import { useTransition } from "react";
import { setProductStatus, toggleProductFlag } from "@/app/admin/actions";
import type { ProductStatus } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

export function ProductRowActions({ slug, status, featured, popular, part }: { slug: string; status: ProductStatus; featured: boolean; popular: boolean; part: "flags" | "status" }) {
  const [pending, start] = useTransition();
  const chip = (on: boolean) => cn("border px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50", on ? "border-ink bg-ink text-paper" : "border-line text-steel hover:border-ink");

  if (part === "flags")
    return (
      <div className="flex gap-1">
        <button disabled={pending} aria-pressed={featured} className={chip(featured)} onClick={() => start(() => toggleProductFlag(slug, "featured", !featured))}>À la une</button>
        <button disabled={pending} aria-pressed={popular} className={chip(popular)} onClick={() => start(() => toggleProductFlag(slug, "popular", !popular))}>Populaire</button>
      </div>
    );

  return (
    <div className="flex gap-1">
      {status !== "published" && <button disabled={pending} className={chip(false)} onClick={() => start(() => setProductStatus(slug, "published"))}>Publier</button>}
      {status === "published" && <button disabled={pending} className={chip(false)} onClick={() => start(() => setProductStatus(slug, "draft"))}>Dépublier</button>}
      {status !== "archived" ? (
        <button disabled={pending} className={chip(false)} onClick={() => confirm("Archiver ce produit ? Il disparaîtra du site.") && start(() => setProductStatus(slug, "archived"))}>Archiver</button>
      ) : (
        <button disabled={pending} className={chip(false)} onClick={() => start(() => setProductStatus(slug, "draft"))}>Restaurer</button>
      )}
    </div>
  );
}
