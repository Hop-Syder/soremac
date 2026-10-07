/**
 * En-tête des pages intérieures — sombre, typographie forte, fil d'Ariane.
 * @hopsyder
 */
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Reveal } from "@/components/motion/Reveal";

export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <section className="bg-ink pb-14 pt-28 text-paper md:pb-20 md:pt-40">
      <div className="container-x">
        {crumbs && <Breadcrumb items={crumbs} tone="light" />}
        <Reveal>
          {eyebrow && <p className="eyebrow mt-8 text-paper/60!">{eyebrow}</p>}
          <h1 className="h-section mt-4 max-w-5xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg text-paper/70">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
