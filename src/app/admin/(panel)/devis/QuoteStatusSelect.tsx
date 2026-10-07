/** Changement de statut d'une demande (mise à jour optimiste). @hopsyder */
"use client";

import { useOptimistic, useTransition } from "react";
import { setQuoteStatus } from "@/app/admin/actions";
import { Select } from "@/components/admin/ui";

const OPTIONS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_traitement", label: "En traitement" },
  { value: "traite", label: "Traité" },
  { value: "archive", label: "Archivé" },
] as const;

type S = (typeof OPTIONS)[number]["value"];

export function QuoteStatusSelect({ id, status }: { id: string; status: S }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useOptimistic(status);
  return (
    <label className="grid gap-1.5 text-[13px] font-medium">
      Statut
      <Select
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as S;
          start(async () => {
            setValue(next);
            await setQuoteStatus(id, next);
          });
        }}
      >
        {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
    </label>
  );
}
