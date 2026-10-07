/**
 * Les 11 familles du catalogue SOREMAC — données initiales (seed).
 * Source de vérité en production : Supabase, via le back-office (/admin).
 * NB : les visuels Unsplash sont des emplacements provisoires à remplacer par la
 * production photo SOREMAC (direction artistique TDR §49).
 * @hopsyder
 */
import type { Category } from "./types";

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const seedCategories: Category[] = [
  {
    slug: "acier-fer",
    name: "Acier & Fer",
    shortName: "Acier",
    description: "Fers à béton Fe400 et Fe500, du Ø 6 au Ø 32 mm, pour vos structures en béton armé.",
    image: u("photo-1504307651254-35680f356dfd"),
    size: "xl",
    related: ["cimenterie-liants", "maconnerie", "equipements-chantier", "quincaillerie-outillage"],
    seoTitle: "Fer à béton à Cotonou — Fe400, Fe500 | SOREMAC",
    seoDescription: "Fer à béton Fe400 et Fe500 du Ø 6 au Ø 32 mm à Cotonou. Vente détail & gros, devis rapide sur WhatsApp.",
  },
  {
    slug: "cimenterie-liants",
    name: "Cimenterie & Liants",
    shortName: "Ciment",
    description: "Ciments et adjuvants pour bétons, mortiers, chapes et enduits.",
    image: u("photo-1590725121839-892b45745d42"),
    size: "lg",
    related: ["acier-fer", "maconnerie", "equipements-chantier"],
    seoTitle: "Ciment et adjuvants Sika à Cotonou | SOREMAC",
    seoDescription: "Ciment, Sikalatex, Sikalite : liants et adjuvants pour vos chantiers à Cotonou et au Bénin.",
  },
  {
    slug: "maconnerie",
    name: "Maçonnerie",
    shortName: "Maçonnerie",
    description: "Parpaings, hourdis et blocs pour le gros œuvre.",
    image: u("photo-1590725140246-20acdee442be"),
    size: "md",
    related: ["cimenterie-liants", "acier-fer", "equipements-chantier"],
  },
  {
    slug: "toiture-couverture",
    name: "Toiture & Couverture",
    shortName: "Toiture",
    description: "Tôles et produits de protection pour vos couvertures.",
    image: u("photo-1632759145354-ed692484c06a"),
    size: "lg",
    related: ["peinture", "quincaillerie-outillage"],
    seoTitle: "Tôles et toiture à Cotonou — Toiturol | SOREMAC",
  },
  {
    slug: "carrelage-revetements",
    name: "Carrelage & Revêtements",
    shortName: "Carrelage",
    description: "Carreaux de sol et de mur pour intérieurs et extérieurs.",
    image: u("photo-1615529182904-14819c35db37"),
    size: "md",
    related: ["cimenterie-liants", "sanitaire", "peinture"],
    seoTitle: "Carrelage à Cotonou | SOREMAC",
  },
  {
    slug: "plomberie-robinetterie",
    name: "Plomberie & Robinetterie",
    shortName: "Plomberie",
    description: "Tubes, raccords et robinetterie pour vos réseaux.",
    image: u("photo-1607472586893-edb57bdc0e39"),
    size: "sm",
    related: ["sanitaire", "quincaillerie-outillage"],
  },
  {
    slug: "sanitaire",
    name: "Sanitaire",
    shortName: "Sanitaire",
    description: "Lavabos, WC et équipements de salle de bain.",
    image: u("photo-1584622650111-993a426fbf0a"),
    size: "sm",
    related: ["plomberie-robinetterie", "carrelage-revetements"],
  },
  {
    slug: "electricite",
    name: "Électricité",
    shortName: "Électricité",
    description: "Matériel électrique pour le bâtiment.",
    image: u("photo-1621905251189-08b45d6a269e"),
    size: "sm",
    related: ["quincaillerie-outillage"],
  },
  {
    slug: "peinture",
    name: "Peinture",
    shortName: "Peinture",
    description: "Peintures et produits de finition.",
    image: u("photo-1562259949-e8e7689d7828"),
    size: "sm",
    related: ["toiture-couverture", "quincaillerie-outillage"],
  },
  {
    slug: "quincaillerie-outillage",
    name: "Quincaillerie & Outillage",
    shortName: "Quincaillerie",
    description: "Visserie, fixations et outillage pour artisans et chantiers.",
    image: u("photo-1581783898377-1c85bf937427"),
    size: "md",
    related: ["equipements-chantier", "electricite"],
  },
  {
    slug: "equipements-chantier",
    name: "Équipements de chantier",
    shortName: "Équipements",
    description: "Bétonnières et équipements pour vos chantiers.",
    image: u("photo-1541888946425-d81bb19240f5"),
    size: "md",
    related: ["cimenterie-liants", "acier-fer", "maconnerie"],
  },
];
