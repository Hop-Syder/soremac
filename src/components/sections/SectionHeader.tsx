/**
 * En-tête de section unique pour tout le site : sur-titre, titre, texte, action à droite.
 * Garantit le même rythme (marges, largeurs de texte) d'une section à l'autre.
 * @hopsyder
 */
import type { ReactNode } from "react";
import { SplitWords } from "@/components/motion/HomeMotion";
import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", tone === "dark" && "eyebrow-dark")}>{eyebrow}</p>}
        <h2 data-m="words" className={cn("t-h2", eyebrow && "mt-4", tone === "dark" && "text-white")}>{typeof title === "string" ? <SplitWords text={title} /> : title}</h2>
        {intro && <p data-m="fade" className={cn("t-lead mt-4 max-w-2xl", tone === "dark" && "text-white/65", align === "center" && "mx-auto")}>{intro}</p>}
      </div>
      {action && <div data-m="fade" className="shrink-0">{action}</div>}
    </div>
  );
}
