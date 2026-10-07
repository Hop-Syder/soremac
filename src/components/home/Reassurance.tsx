/**
 * 03 — Bande de réassurance (TDR §10) : 4 engagements, reveal horizontal léger, pas de compteur.
 * @hopsyder
 */
import { HandshakeIcon, MedalIcon, StorefrontIcon, TruckIcon } from "@phosphor-icons/react/ssr";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { yearsOfExperience } from "@/lib/site";

export function Reassurance() {
  const items = [
    { icon: MedalIcon, title: `${yearsOfExperience()}+ ans d'expérience`, text: "Au service du BTP depuis 1995" },
    { icon: StorefrontIcon, title: "Vente détail & gros", text: "Du sac de ciment au chantier complet" },
    { icon: TruckIcon, title: "Livraison", text: "À Cotonou et environs" },
    { icon: HandshakeIcon, title: "Conseil technique", text: "Une équipe pour vous orienter" },
  ];
  return (
    <section aria-label="Nos engagements" className="relative z-10">
      <div className="shell">
        <Stagger className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} dir="left" className="flex items-center gap-4 bg-white p-5 md:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-2">
                <Icon size={24} weight="duotone" />
              </span>
              <span>
                <span className="block font-semibold tracking-tight">{title}</span>
                <span className="block text-sm text-steel">{text}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
