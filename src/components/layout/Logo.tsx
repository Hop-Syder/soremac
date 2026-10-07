/**
 * Logotype provisoire — monogramme « poutrelles » + wordmark.
 * À remplacer par le logo officiel SOREMAC (SVG) dès réception.
 * @hopsyder
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const fg = tone === "dark" ? "#14161a" : "#ffffff";
  return (
    <Link href="/" aria-label="SOREMAC — accueil" className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
        <rect width="34" height="34" rx="9" fill="#f2701d" />
        <rect x="8" y="9" width="18" height="3.6" rx="1.2" fill={tone === "dark" ? "#14161a" : "#14161a"} />
        <rect x="8" y="15.2" width="12" height="3.6" rx="1.2" fill="#14161a" />
        <rect x="8" y="21.4" width="18" height="3.6" rx="1.2" fill="#14161a" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[21px] font-extrabold tracking-[-0.04em]" style={{ color: fg }}>soremac</span>
        <span className={cn("mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.22em]", tone === "dark" ? "text-steel" : "text-white/55")}>Matériaux · depuis 1995</span>
      </span>
    </Link>
  );
}
