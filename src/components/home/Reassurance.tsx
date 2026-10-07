/**
 * Bande de réassurance (TDR §10) — reveal horizontal léger, pas de compteur.
 * @hopsyder
 */
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { yearsOfExperience } from "@/lib/site";

export function Reassurance() {
  const items = [
    { k: `${yearsOfExperience()}+ ans`, v: "d'expérience, depuis 1995" },
    { k: "Détail & gros", v: "Particuliers comme professionnels" },
    { k: "Livraison", v: "À Cotonou et environs" },
    { k: "Conseil", v: "Aide au choix technique" },
  ];
  return (
    <section aria-label="Nos engagements" className="border-b border-line bg-paper">
      <Stagger className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <StaggerItem key={it.k} dir="left" className={`py-7 pr-4 md:py-9 ${i % 2 ? "border-l border-line pl-4 md:pl-8" : ""} ${i === 2 ? "border-t border-line lg:border-l lg:border-t-0 lg:pl-8" : ""} ${i === 3 ? "border-t lg:border-t-0" : ""}`}>
            <p className="font-display text-2xl font-bold uppercase md:text-3xl">{it.k}</p>
            <p className="mt-1 text-sm text-steel">{it.v}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
