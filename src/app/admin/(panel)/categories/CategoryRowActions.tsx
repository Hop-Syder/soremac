/** Réorganiser / supprimer une catégorie. @hopsyder */
"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { deleteCategory, moveCategory } from "@/app/admin/actions";

export function CategoryRowActions({ slug, first, last }: { slug: string; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const btn = "grid size-9 place-items-center text-steel hover:bg-paper hover:text-ink disabled:opacity-30";
  // stopPropagation : les boutons sont dans le <summary>, ils ne doivent pas ouvrir le panneau
  const run = (e: React.MouseEvent, fn: () => Promise<unknown>) => {
    e.preventDefault();
    e.stopPropagation();
    start(async () => { await fn(); });
  };
  return (
    <span className="flex shrink-0 items-center" aria-busy={pending}>
      <button className={btn} disabled={first || pending} onClick={(e) => run(e, () => moveCategory(slug, -1))} aria-label="Monter"><ArrowUp size={16} /></button>
      <button className={btn} disabled={last || pending} onClick={(e) => run(e, () => moveCategory(slug, 1))} aria-label="Descendre"><ArrowDown size={16} /></button>
      <button
        className={btn}
        disabled={pending}
        aria-label="Supprimer"
        onClick={(e) =>
          run(e, async () => {
            if (!confirm("Supprimer définitivement cette catégorie ?")) return;
            const res = await deleteCategory(slug);
            if (res?.errors) alert(res.errors[0]);
          })
        }
      >
        <Trash2 size={16} />
      </button>
    </span>
  );
}
