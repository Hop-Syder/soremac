/**
 * 08 — « L'expérience qui accompagne vos projets. » (TDR §14)
 * Carte héros (ancienneté) + 5 arguments apparaissant en cascade (stagger 65 ms).
 * @hopsyder
 */
import { ChatsCircleIcon, HandshakeIcon, MapPinIcon, MedalIcon, StackIcon } from "@phosphor-icons/react/ssr";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SITE, yearsOfExperience } from "@/lib/site";

const reasons = [
  { icon: MedalIcon, title: "Expérience", text: `Depuis ${SITE.foundedYear}, au service des particuliers et des professionnels.` },
  { icon: StackIcon, title: "Large gamme", text: "Des matériaux du gros œuvre aux équipements et finitions." },
  { icon: HandshakeIcon, title: "Conseil", text: "Une assistance dans le choix des matériaux." },
  { icon: MapPinIcon, title: "Proximité", text: `Implantation stratégique à ${SITE.address.district}, Cotonou.` },
  { icon: ChatsCircleIcon, title: "Réactivité", text: "Contacts directs par téléphone, WhatsApp et email." },
];

export function WhySoremac() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
      <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-ink p-8 text-white md:p-10">
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-accent/30 blur-[80px]" />
        <p className="eyebrow eyebrow-dark self-start">Depuis {SITE.foundedYear}</p>
        <div className="relative mt-16">
          <p className="tabular font-display text-[clamp(6rem,12vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.06em] text-accent">{yearsOfExperience()}</p>
          <p className="mt-4 font-display text-2xl font-semibold tracking-tight">ans au service de la construction au Bénin.</p>
          <p className="mt-3 text-white/60">Une entreprise historique, une expérience d'achat moderne.</p>
        </div>
      </Reveal>
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {reasons.map(({ icon: Icon, title, text }, i) => (
          <StaggerItem key={title} className={`rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-card)] md:p-7 ${i === 4 ? "sm:col-span-2" : ""}`}>
            <span className="grid size-12 place-items-center rounded-xl bg-paper text-accent-2"><Icon size={24} weight="duotone" /></span>
            <h3 className="t-h3 mt-5">{title}</h3>
            <p className="mt-2 text-steel">{text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
