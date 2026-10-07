/**
 * Informations officielles SOREMAC (NAP — Name, Address, Phone).
 * Source unique : toute page lit ces constantes pour garantir la cohérence SEO local (TDR §41).
 * @hopsyder
 */

export const SITE = {
  name: "SOREMAC SARL",
  shortName: "SOREMAC",
  legalName: "Société REDA de Matériaux de Construction et de Ciment",
  tagline: "Construire commence par le bon matériau.",
  description:
    "Matériaux de construction, équipements et solutions pour vos projets au Bénin. Vente détail & gros à Cotonou depuis 1995.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.soremac.com",
  foundedYear: 1995,
  rccmYear: 2008,
  phone: "+229 52 14 00 00",
  phoneHref: "tel:+22952140000",
  whatsapp: "22952140000",
  whatsappDisplay: "+229 52 14 00 00",
  // TODO(SOREMAC) : confirmer l'adresse email officielle avant mise en production
  email: "contact@soremac.com",
  clientSpace: "https://mysoremac.com",
  address: {
    district: "Vedoko",
    quarter: "Agontinkon",
    landmark: "Voie quittant Étoile vers Toyota, à gauche",
    plot: "Carré 1304/M",
    city: "Cotonou",
    country: "Bénin",
    countryCode: "BJ",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=SOREMAC+Vedoko+Cotonou",
  mapsEmbed: "https://www.google.com/maps?q=Vedoko+Agontinkon+Cotonou&output=embed",
  hours: [
    { days: "Lundi – Vendredi", slots: "08h00 – 13h00 · 15h00 – 18h00" },
    { days: "Samedi", slots: "08h00 – 13h00" },
    { days: "Dimanche", slots: "Fermé" },
  ],
  legal: {
    rccm: "RB/COT/2008-B3899",
    ifu: "3200700012811",
    capital: "150 000 000 FCFA",
  },
  payments: ["Comptant", "Chèque", "Mobile Money"],
} as const;

/** Années d'existence, calculées dynamiquement (jamais codées en dur). */
export const yearsOfExperience = () => new Date().getFullYear() - SITE.foundedYear;

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/conseils", label: "Conseils" },
  { href: "/contact", label: "Contact" },
] as const;
