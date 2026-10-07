/**
 * Services SOREMAC (TDR §15, §37) — partagés entre la homepage et /services.
 * @hopsyder
 */
import { ClipboardTextIcon, HandshakeIcon, LightbulbIcon, StorefrontIcon, TruckIcon, WalletIcon } from "@phosphor-icons/react/ssr";
import { SITE } from "./site";

export const SERVICES = [
  { n: "01", icon: StorefrontIcon, title: "Vente & distribution", text: "Vente au détail et en gros. Du sac de ciment à l'approvisionnement complet d'un chantier.", img: "photo-1590725121839-892b45745d42" },
  { n: "02", icon: TruckIcon, title: "Livraison", text: "Livraison assurée à Cotonou et environs selon les conditions commerciales.", img: "photo-1581094288338-2314dddb7ece" },
  { n: "03", icon: LightbulbIcon, title: "Conseil technique", text: "Notre équipe vous aide à choisir les bons matériaux selon votre ouvrage.", img: "photo-1503387762-592deb58ef4e" },
  { n: "04", icon: ClipboardTextIcon, title: "Demande de devis", text: "Par téléphone, WhatsApp, email ou directement depuis le catalogue en ligne.", img: "photo-1541888946425-d81bb19240f5" },
  { n: "05", icon: WalletIcon, title: "Paiement", text: `${SITE.payments.join(", ")}.`, img: "photo-1504307651254-35680f356dfd" },
];

export const ACCOMPANIMENT = {
  n: "06",
  icon: HandshakeIcon,
  title: "Accompagnement",
  text: "Un interlocuteur pour suivre vos besoins tout au long du chantier, du gros œuvre aux finitions.",
  img: "photo-1564013799919-ab600027ffc6",
};

export const unsplash = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
