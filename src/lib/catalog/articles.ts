/**
 * Articles « Conseils » — contenu SEO éditorial (TDR §39).
 * Contenus volontairement généraux : à faire relire par l'équipe technique SOREMAC.
 * @hopsyder
 */
import type { Article } from "./types";

const u = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=crop`;

export const articles: Article[] = [
  {
    slug: "comment-choisir-son-fer-a-beton",
    title: "Comment choisir son fer à béton ?",
    excerpt: "Grade, diamètre, quantité : les questions à se poser avant de commander vos aciers.",
    category: "Acier & Fer",
    readingTime: 5,
    image: u("photo-1504307651254-35680f356dfd"),
    productCategories: ["acier-fer"],
    body: [
      { heading: "Partir des plans", text: "Le ferraillage d'un ouvrage est défini par l'étude de structure. Les plans indiquent le grade, le diamètre et la longueur des armatures pour chaque élément : fondations, poteaux, poutres et dalles." },
      { heading: "Grade et diamètre", text: "SOREMAC propose les grades Fe400 et Fe500, du Ø 6 au Ø 32 mm. Les petits diamètres servent généralement aux cadres et étriers, les plus gros aux armatures principales." },
      { heading: "Anticiper les quantités", text: "Transmettez votre nomenclature d'aciers à notre équipe : nous établissons un devis complet, en détail ou en gros." },
    ],
  },
  {
    slug: "fe400-ou-fe500-quelle-difference",
    title: "Fe400 ou Fe500 : quelle différence ?",
    excerpt: "Deux grades d'acier, deux niveaux de résistance. Comprendre ce que signifient ces chiffres.",
    category: "Acier & Fer",
    readingTime: 4,
    image: u("photo-1541888946425-d81bb19240f5"),
    productCategories: ["acier-fer"],
    body: [
      { heading: "Ce que signifie le chiffre", text: "Le nombre associé au grade renvoie à la limite d'élasticité de l'acier, exprimée en mégapascals. Plus il est élevé, plus l'acier supporte de contrainte avant de se déformer durablement." },
      { heading: "Lequel choisir ?", text: "Le grade est imposé par le calcul de structure : il ne se remplace pas librement. Respectez le grade prescrit sur vos plans et consultez votre ingénieur en cas de doute." },
    ],
  },
  {
    slug: "comment-choisir-ses-carreaux",
    title: "Comment choisir ses carreaux ?",
    excerpt: "Usage, pièce, format et entretien : les bons critères pour un carrelage durable.",
    category: "Carrelage",
    readingTime: 6,
    image: u("photo-1615529182904-14819c35db37"),
    productCategories: ["carrelage-revetements"],
    body: [
      { heading: "Selon la pièce", text: "Un sol extérieur, une salle de bain ou un séjour n'imposent pas les mêmes contraintes : glissance, résistance à l'usure, exposition à l'eau." },
      { heading: "Prévoir une marge", text: "Commandez une marge pour les coupes et la casse, et conservez quelques carreaux du même lot pour d'éventuelles réparations." },
    ],
  },
  {
    slug: "quel-ciment-choisir",
    title: "Quel ciment choisir pour son chantier ?",
    excerpt: "Béton, mortier, enduit : adapter le liant à l'ouvrage.",
    category: "Cimenterie",
    readingTime: 5,
    image: u("photo-1590725121839-892b45745d42"),
    productCategories: ["cimenterie-liants"],
    body: [
      { heading: "L'ouvrage d'abord", text: "Le choix du ciment dépend de l'usage : béton structurel, maçonnerie, enduit ou chape. Les classes de résistance indiquées sur le sac guident ce choix." },
      { heading: "Stockage", text: "Stockez les sacs au sec, surélevés du sol, et utilisez-les rapidement : un ciment exposé à l'humidité perd ses qualités." },
    ],
  },
  {
    slug: "comment-choisir-une-tole-de-toiture",
    title: "Comment choisir une tôle de toiture ?",
    excerpt: "Matière, profil, couleur et longueur : bien préparer sa commande de couverture.",
    category: "Toiture",
    readingTime: 4,
    image: u("photo-1632759145354-ed692484c06a"),
    productCategories: ["toiture-couverture"],
    body: [
      { heading: "Mesurer précisément", text: "La longueur des tôles dépend de la longueur des versants et du recouvrement. Un relevé précis évite les pertes." },
      { heading: "Protéger dans la durée", text: "Un entretien régulier prolonge la durée de vie de la couverture. Pour les produits de traitement comme TOITUROL, exigez l'authenticité du produit." },
    ],
  },
  {
    slug: "5-erreurs-a-eviter-avant-d-acheter-vos-materiaux",
    title: "5 erreurs à éviter avant d'acheter vos matériaux",
    excerpt: "Quantités approximatives, contrefaçons, stockage : les pièges les plus fréquents.",
    category: "Conseils généraux",
    readingTime: 7,
    image: u("photo-1503387762-592deb58ef4e"),
    productCategories: ["acier-fer", "cimenterie-liants", "maconnerie"],
    body: [
      { heading: "1. Acheter sans métré", text: "Sans métré, on commande trop ou pas assez. Partez de vos plans et faites valider vos quantités." },
      { heading: "2. Négliger l'authenticité", text: "Certaines références sont contrefaites. Achetez auprès d'un distributeur établi et vérifiez les emballages." },
      { heading: "3. Mal stocker", text: "Ciment à l'humidité, aciers au contact du sol : un mauvais stockage dégrade les matériaux." },
      { heading: "4. Tout commander au dernier moment", text: "Anticipez les commandes importantes pour sécuriser la disponibilité." },
      { heading: "5. Ne pas demander conseil", text: "Notre équipe vous oriente gratuitement dans le choix des références. Profitez-en." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
