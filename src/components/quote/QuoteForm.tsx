/**
 * Formulaire de demande de devis — partagé par le drawer et la page /devis.
 * Deux sorties : envoi au back-office (/api/devis) ou message WhatsApp pré-rempli.
 * @hopsyder
 */
"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useQuote, variantLabel } from "./QuoteProvider";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappQuote } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

const field =
  "h-12 w-full rounded-[3px] border border-line bg-white px-3.5 text-[15px] outline-none transition-colors placeholder:text-steel-2 focus:border-ink";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const { items, clear } = useQuote();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [data, setData] = useState({ name: "", phone: "", email: "", note: "" });

  const lines = items.map((i) => ({ name: i.name, variant: variantLabel(i.variant), quantity: i.quantity, unit: i.unit }));
  const waHref = whatsappQuote(lines, { name: data.name, note: data.note });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items: lines }),
      });
      if (!res.ok) throw new Error();
      track("quote_submit", { channel: "form", lines: lines.length });
      setState("sent");
      clear();
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <div className="flex flex-col items-start gap-3 rounded-[3px] bg-ink p-6 text-paper" role="status">
        <span className="grid size-10 place-items-center rounded-full bg-accent text-ink">
          <Check size={20} />
        </span>
        <p className="font-display text-2xl font-bold uppercase">Demande envoyée.</p>
        <p className="text-sm text-paper/70">Notre équipe vous recontacte rapidement par téléphone ou WhatsApp.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <label className="grid gap-1.5 text-[13px] font-medium">
          Nom *
          <input required autoComplete="name" className={field} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </label>
        <label className="grid gap-1.5 text-[13px] font-medium">
          Téléphone *
          <input required type="tel" inputMode="tel" autoComplete="tel" placeholder="+229" className={field} value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
        </label>
      </div>
      <label className="grid gap-1.5 text-[13px] font-medium">
        Email
        <input type="email" autoComplete="email" className={field} value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
      </label>
      <label className="grid gap-1.5 text-[13px] font-medium">
        Commentaire
        <textarea rows={3} className={`${field} h-auto py-3`} placeholder="Délai, lieu de livraison, précisions…" value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} />
      </label>
      {state === "error" && <p className="text-sm text-red-700">L'envoi a échoué. Réessayez ou envoyez votre demande sur WhatsApp.</p>}
      <div className="mt-1 grid gap-2.5">
        <Button type="submit" size="lg" disabled={!items.length || state === "sending"}>
          {state === "sending" ? <Loader2 className="animate-spin" size={18} /> : null}
          Envoyer la demande
        </Button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "quote", lines: lines.length })}
          aria-disabled={!items.length}
          className={`inline-flex h-14 items-center justify-center gap-2.5 rounded-[3px] bg-whatsapp px-8 text-[15px] font-semibold text-white transition hover:brightness-110 ${items.length ? "" : "pointer-events-none opacity-50"}`}
        >
          <WhatsAppIcon /> Envoyer sur WhatsApp
        </a>
      </div>
    </form>
  );
}
