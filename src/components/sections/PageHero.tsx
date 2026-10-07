/**
 * En-tête des pages intérieures — clair, fil d'Ariane, titre fort, intro, slot libre.
 * Le décalage haut compense le header fixe (bandeau + barre).
 * @hopsyder
 */
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Reveal } from "@/components/motion/Reveal";

export function PageHero({ eyebrow, title, intro, crumbs, children, aside }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-b border-line pb-12 pt-32 md:pb-16 md:pt-44">
      <div className="shell">
        {crumbs && <Breadcrumb items={crumbs} />}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Reveal>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="t-h1 mt-5 max-w-4xl">{title}</h1>
            {intro && <p className="t-lead mt-5 max-w-2xl">{intro}</p>}
          </Reveal>
          {aside && <Reveal delay={0.1}>{aside}</Reveal>}
        </div>
        {children}
      </div>
    </section>
  );
}
