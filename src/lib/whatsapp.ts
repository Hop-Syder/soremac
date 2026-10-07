/**
 * Génération de liens WhatsApp contextualisés (TDR §57).
 * @hopsyder
 */
import { SITE } from "./site";

export interface QuoteLine {
  name: string;
  variant?: string;
  quantity: number;
  unit?: string;
}

const base = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const whatsappGeneral = () =>
  base("Bonjour SOREMAC, je souhaite avoir des informations sur vos matériaux.");

export const whatsappProduct = (productName: string, variant?: string) =>
  base(
    `Bonjour SOREMAC, je souhaite avoir des informations sur : ${productName}${variant ? ` (${variant})` : ""}.`,
  );

export const whatsappQuote = (lines: QuoteLine[], extra?: { name?: string; note?: string }) => {
  const list = lines
    .map((l) => `• ${l.name}${l.variant ? ` — ${l.variant}` : ""} : ${l.quantity} ${l.unit ?? "unité(s)"}`)
    .join("\n");
  const parts = [
    "Bonjour SOREMAC, je souhaite demander un devis pour les produits suivants :",
    list,
    extra?.note ? `\nCommentaire : ${extra.note}` : "",
    extra?.name ? `\n— ${extra.name}` : "",
  ];
  return base(parts.filter(Boolean).join("\n"));
};
