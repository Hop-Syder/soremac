/**
 * Logotype provisoire (wordmark) — à remplacer par le logo officiel SOREMAC (SVG).
 * @hopsyder
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="SOREMAC — accueil" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center bg-accent font-display text-lg font-black text-ink" aria-hidden>
        S
        <span className="absolute -bottom-1 -right-1 size-2.5 bg-current" style={{ color: tone === "dark" ? "#121314" : "#f5f3ef" }} />
      </span>
      <span className={cn("font-display text-[22px] font-extrabold uppercase leading-none tracking-tight [font-stretch:80%]", tone === "dark" ? "text-ink" : "text-paper")}>
        Soremac
        <span className="ml-1 align-top text-[10px] font-semibold tracking-[0.2em] text-accent">SARL</span>
      </span>
    </Link>
  );
}
