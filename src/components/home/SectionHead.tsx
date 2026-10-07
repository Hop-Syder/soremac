/** En-tête de section éditorial réutilisable. @hopsyder */
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHead({ index, eyebrow, title, intro, action, light }: { index?: string; eyebrow: string; title: ReactNode; intro?: ReactNode; action?: ReactNode; light?: boolean }) {
  return (
    <Reveal className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className={`eyebrow ${light ? "text-paper/60!" : ""}`}>{index && <span className="tabular">{index}</span>} {eyebrow}</p>
        <h2 className="h-section mt-4 max-w-4xl">{title}</h2>
        {intro && <p className={`mt-5 max-w-2xl text-lg ${light ? "text-paper/70" : "text-steel"}`}>{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}
