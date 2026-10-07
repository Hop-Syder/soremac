/**
 * 11 — « Achetez avec confiance. » (TDR §17) — section courte et crédible.
 * Recommandations d'authenticité issues du dossier SOREMAC (TOITUROL, Sika).
 * @hopsyder
 */
import { SealCheckIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export function Quality() {
  return (
    <div className="grid gap-4 rounded-[28px] border border-line bg-white p-6 shadow-[var(--shadow-card)] md:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
      <Reveal>
        <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-2"><ShieldCheckIcon size={30} weight="duotone" /></span>
        <h2 className="t-h2 mt-6">Achetez avec confiance.</h2>
        <p className="t-lead mt-4">SOREMAC privilégie la qualité des produits et l'authenticité des références distribuées.</p>
      </Reveal>
      <Stagger className="grid gap-3">
        {[
          { brand: "TOITUROL", text: "Exigez l'authenticité du produit." },
          { brand: "Sika", text: "Originalité des produits garantie." },
        ].map((r) => (
          <StaggerItem key={r.brand} className="flex items-start gap-4 rounded-2xl bg-paper p-5">
            <SealCheckIcon size={26} weight="fill" className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">{r.brand}</p>
              <p className="text-steel">{r.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
