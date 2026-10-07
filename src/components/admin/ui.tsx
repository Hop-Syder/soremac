/**
 * Petits composants partagés du back-office (champs, badges, boutons d'envoi, alertes).
 * Même design system que le site, en version dense et utilitaire.
 * @hopsyder
 */
"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";

export const inputClass =
  "h-11 w-full rounded-[3px] border border-line bg-white px-3 text-[14px] outline-none transition-colors placeholder:text-steel-2 focus:border-ink disabled:bg-paper-2";

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("grid content-start gap-1.5 text-[13px] font-medium", className)}>
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-steel">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea rows={4} {...props} className={cn(inputClass, "h-auto py-2.5 leading-relaxed", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cn(inputClass, "pr-8", props.className)} />;
}

export function SubmitButton({ children, variant = "primary", className }: { children: ReactNode; variant?: "primary" | "dark" | "outline"; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, "md", className)}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Notice({ tone, children }: { tone: "error" | "success" | "info"; children: ReactNode }) {
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 border-l-2 px-4 py-3 text-sm",
        tone === "error" && "border-red-700 bg-red-50 text-red-900",
        tone === "success" && "border-whatsapp bg-emerald-50 text-emerald-900",
        tone === "info" && "border-accent bg-white text-ink",
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    published: ["Publié", "bg-emerald-100 text-emerald-900"],
    draft: ["Brouillon", "bg-paper-2 text-ink"],
    archived: ["Archivé", "bg-ink/10 text-steel"],
    nouveau: ["Nouveau", "bg-accent text-ink"],
    en_traitement: ["En traitement", "bg-amber-100 text-amber-900"],
    traite: ["Traité", "bg-emerald-100 text-emerald-900"],
    archive: ["Archivé", "bg-ink/10 text-steel"],
  };
  const [label, cls] = map[status] ?? [status, "bg-paper-2"];
  return <span className={cn("inline-block whitespace-nowrap px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider", cls)}>{label}</span>;
}

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 border border-line bg-white", className)}>
      {title && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em]">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
