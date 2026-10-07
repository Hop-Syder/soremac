/**
 * Services SOREMAC (TDR §15, §37) — partagés entre la homepage et /services.
 * @hopsyder
 */
import { Banknote, ClipboardCheck, Lightbulb, Store, Truck } from "lucide-react";
import { SITE } from "./site";

export const SERVICES = [
  { n: "01", icon: Store, title: "Vente & distribution", text: "Vente au détail et en gros. Du sac de ciment à l'approvisionnement complet d'un chantier." },
  { n: "02", icon: Truck, title: "Livraison", text: "Livraison assurée à Cotonou et environs selon les conditions commerciales." },
  { n: "03", icon: Lightbulb, title: "Conseil technique", text: "Notre équipe vous aide à choisir les bons matériaux selon votre ouvrage." },
  { n: "04", icon: ClipboardCheck, title: "Demande de devis", text: "Par téléphone, WhatsApp, email ou directement depuis le catalogue en ligne." },
  { n: "05", icon: Banknote, title: "Paiement", text: `${SITE.payments.join(", ")}.` },
];
