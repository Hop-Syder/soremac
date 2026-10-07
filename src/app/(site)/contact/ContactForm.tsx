/** Formulaire de contact — envoi via /api/devis (type « contact »). @hopsyder */
"use client";

import { useState } from "react";
import { CheckIcon, SpinnerIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";

const field = "h-12 w-full rounded-[10px] border border-line bg-paper/50 px-3.5 text-[15px] outline-none transition-colors focus:border-ink/50 focus:bg-white";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/devis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contact", ...body }) });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-[18px] bg-paper p-6">
        <span className="grid size-12 place-items-center rounded-full bg-accent text-ink"><CheckIcon size={22} weight="bold" /></span>
        <p className="font-display text-2xl font-semibold tracking-tight">Message envoyé.</p>
        <p className="text-steel">Nous revenons vers vous rapidement.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">Nom *<input name="name" required autoComplete="name" className={field} /></label>
        <label className="grid gap-1.5 text-sm font-medium">Téléphone *<input name="phone" type="tel" required autoComplete="tel" placeholder="+229" className={field} /></label>
        <label className="grid gap-1.5 text-sm font-medium">Email<input name="email" type="email" autoComplete="email" className={field} /></label>
        <label className="grid gap-1.5 text-sm font-medium">Entreprise <span className="font-normal text-steel">(optionnel)</span><input name="company" autoComplete="organization" className={field} /></label>
      </div>
      <label className="grid gap-1.5 text-sm font-medium">Objet *<input name="subject" required className={field} /></label>
      <label className="grid gap-1.5 text-sm font-medium">Message *<textarea name="note" required rows={5} className={`${field} h-auto py-3`} /></label>
      {state === "error" && <p className="text-sm text-red-700">L'envoi a échoué. Réessayez ou contactez-nous sur WhatsApp.</p>}
      <Button type="submit" size="lg" disabled={state === "sending"} className="sm:justify-self-start">
        {state === "sending" && <SpinnerIcon size={18} className="animate-spin" />} Envoyer ma demande
      </Button>
    </form>
  );
}
