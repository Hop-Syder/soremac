export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  featured?: boolean;
}

export const categories: Category[] = [
  { id: 'acier-fer', name: 'Acier & Fer', slug: 'acier-fer', description: 'Fers à béton, treillis soudés, profilés métalliques', icon: '🔩', productCount: 24, featured: true },
  { id: 'cimenterie', name: 'Cimenterie & Liants', slug: 'cimenterie-liants', description: 'Ciments, chaux, additifs et liants hydrauliques', icon: '🏗️', productCount: 18, featured: true },
  { id: 'maconnerie', name: 'Maçonnerie', slug: 'maconnerie', description: 'Parpaings, briques, hourdis et blocs', icon: '🧱', productCount: 12 },
  { id: 'toiture', name: 'Toiture & Couverture', slug: 'toiture-couverture', description: 'Tôles, accessoires de toiture, gouttières', icon: '🏠', productCount: 16, featured: true },
  { id: 'carrelage', name: 'Carrelage & Revêtements', slug: 'carrelage-revetements', description: 'Carreaux sol et mur, mosaïques, plinthes', icon: '🪨', productCount: 32 },
  { id: 'plomberie', name: 'Plomberie & Robinetterie', slug: 'plomberie-robinetterie', description: 'Tubes, raccords, robinets et accessoires', icon: '🚿', productCount: 28 },
  { id: 'sanitaire', name: 'Sanitaire', slug: 'sanitaire', description: 'Lavabos, WC, douches et accessoires', icon: '🛁', productCount: 20 },
  { id: 'electricite', name: 'Électricité', slug: 'electricite', description: 'Câbles, disjoncteurs, prises et éclairage', icon: '⚡', productCount: 36 },
  { id: 'peinture', name: 'Peinture', slug: 'peinture', description: 'Peintures intérieures, extérieures, enduits', icon: '🎨', productCount: 22 },
  { id: 'quincaillerie', name: 'Quincaillerie & Outillage', slug: 'quincaillerie-outillage', description: 'Visserie, outils manuels et électroportatifs', icon: '🔧', productCount: 48 },
  { id: 'equipements', name: 'Équipements de chantier', slug: 'equipements-chantier', description: 'Bétonnières, échafaudages, EPI', icon: '🚜', productCount: 14 },
];

export interface ProductVariant {
  label: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategory?: string;
  brand?: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  characteristics: Record<string, string>;
  variants: ProductVariant[];
  packaging?: string;
  badge?: string;
  featured?: boolean;
  popular?: boolean;
  usage?: string;
  tips?: string;
}

export const products: Product[] = [
  {
    id: 'fer-beton-fe500',
    name: 'Fer à béton Fe500',
    slug: 'fer-a-beton-fe500',
    categoryId: 'acier-fer',
    subcategory: 'Fer à béton',
    shortDescription: 'Barre d\'acier haute adhérence pour béton armé, grade Fe500.',
    description: 'Fer à béton haute adhérence de grade Fe500, conforme aux normes en vigueur. Utilisé pour le renforcement des structures en béton armé : fondations, poteaux, poutres, dalles et planchers.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800&q=80',
    ],
    characteristics: { 'Grade': 'Fe500', 'Type': 'Fer à béton', 'Usage': 'Construction', 'Norme': 'HA (Haute Adhérence)' },
    variants: [
      { label: 'Ø 6 mm', value: '6' },
      { label: 'Ø 8 mm', value: '8' },
      { label: 'Ø 10 mm', value: '10' },
      { label: 'Ø 12 mm', value: '12' },
      { label: 'Ø 14 mm', value: '14' },
      { label: 'Ø 16 mm', value: '16' },
      { label: 'Ø 20 mm', value: '20' },
      { label: 'Ø 25 mm', value: '25' },
      { label: 'Ø 32 mm', value: '32' },
    ],
    packaging: 'Barre de 12 m',
    badge: 'Populaire',
    featured: true,
    popular: true,
    usage: 'Fondations, poteaux, poutres, dalles, planchers, escaliers.',
    tips: 'Stocker à l\'abri de l\'humidité. Respecter les enrobages minimums selon le DTU.',
  },
  {
    id: 'fer-beton-fe400',
    name: 'Fer à béton Fe400',
    slug: 'fer-a-beton-fe400',
    categoryId: 'acier-fer',
    subcategory: 'Fer à béton',
    shortDescription: 'Barre d\'acier haute adhérence pour béton armé, grade Fe400.',
    description: 'Fer à béton haute adhérence de grade Fe400. Adapté aux structures courantes de construction résidentielle et commerciale.',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    ],
    characteristics: { 'Grade': 'Fe400', 'Type': 'Fer à béton', 'Usage': 'Construction' },
    variants: [
      { label: 'Ø 8 mm', value: '8' },
      { label: 'Ø 10 mm', value: '10' },
      { label: 'Ø 12 mm', value: '12' },
      { label: 'Ø 14 mm', value: '14' },
      { label: 'Ø 16 mm', value: '16' },
      { label: 'Ø 20 mm', value: '20' },
    ],
    packaging: 'Barre de 12 m',
    featured: true,
    usage: 'Construction résidentielle, murs, dalles simples.',
  },
  {
    id: 'sikalatex',
    name: 'SIKALatex',
    slug: 'sikalatex',
    categoryId: 'cimenterie',
    subcategory: 'Additifs',
    brand: 'Sika',
    shortDescription: 'Adjuvant latex pour mortiers et bétons. Améliore l\'adhérence et l\'imperméabilité.',
    description: 'SIKALatex est un adjuvant à base de dispersion de résine synthétique. Il améliore l\'adhérence, la flexibilité et l\'imperméabilité des mortiers et bétons. Idéal pour les chapes, enduits et réparations.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
    ],
    characteristics: { 'Marque': 'Sika', 'Type': 'Adjuvant latex', 'Usage': 'Mortiers & bétons', 'Application': 'Chapes, enduits, réparations' },
    variants: [
      { label: '2 Litres', value: '2L' },
      { label: '5 Litres', value: '5L' },
      { label: '20 Litres', value: '20L' },
    ],
    packaging: 'Bidon',
    badge: 'Sika',
    featured: true,
    popular: true,
    usage: 'Amélioration des mortiers pour chapes, enduits, réparations de béton.',
    tips: 'Produit authentique Sika. Vérifier l\'intégralité du packaging à l\'achat.',
  },
  {
    id: 'sikalite',
    name: 'SIKALite',
    slug: 'sikalite',
    categoryId: 'cimenterie',
    subcategory: 'Imperméabilisants',
    brand: 'Sika',
    shortDescription: 'Adjuvant imperméabilisant pour mortiers et bétons.',
    description: 'SIKALite est un adjuvant imperméabilisant de masse pour mortiers et bétons. Il réduit la capillarité et protège les structures contre les infiltrations d\'eau.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    ],
    characteristics: { 'Marque': 'Sika', 'Type': 'Imperméabilisant', 'Usage': 'Mortiers & bétons', 'Action': 'Réduction capillarité' },
    variants: [
      { label: '1 kg', value: '1kg' },
      { label: '25 kg', value: '25kg' },
    ],
    packaging: 'Sac / Seau',
    badge: 'Sika',
    featured: true,
    usage: 'Murs enterrés, fondations, réservoirs, piscines.',
  },
  {
    id: 'toiturol',
    name: 'TOITUROL',
    slug: 'toiturol',
    categoryId: 'toiture',
    subcategory: 'Peinture toiture',
    brand: 'Toiturol',
    shortDescription: 'Peinture protectrice pour tôles de toiture. Anti-corrosion et étanchéité.',
    description: 'TOITUROL est une peinture spéciale toiture qui protège et décore les tôles métalliques. Formule anti-corrosion avec excellente adhérence sur support galvanisé.',
    image: 'https://images.unsplash.com/photo-1632759145354-ed692484c06a?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1632759145354-ed692484c06a?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    ],
    characteristics: { 'Marque': 'TOITUROL', 'Type': 'Peinture toiture', 'Usage': 'Tôles métalliques', 'Propriété': 'Anti-corrosion' },
    variants: [
      { label: '4 Litres', value: '4L' },
      { label: '20 Litres', value: '20L' },
    ],
    packaging: 'Seau',
    badge: 'Authentique',
    featured: true,
    popular: true,
    usage: 'Protection et décoration des tôles de toiture en tôle galvanisée.',
    tips: 'Exiger l\'authenticité du produit TOITUROL. Vérifier le packaging original.',
  },
  {
    id: 'ciment-cpja-35',
    name: 'Ciment CPJ-A 35',
    slug: 'ciment-cpja-35',
    categoryId: 'cimenterie',
    subcategory: 'Ciment',
    brand: 'CIMBENIN',
    shortDescription: 'Ciment Portland composé pour travaux courants de construction.',
    description: 'Ciment Portland composé de classe 35, adapté aux travaux courants de construction : béton, mortier, enduit, dallage.',
    image: 'https://images.unsplash.com/photo-1590725121839-892b45745d42?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590725121839-892b45745d42?w=800&q=80',
    ],
    characteristics: { 'Marque': 'CIMBENIN', 'Type': 'CPJ-A 35', 'Usage': 'Construction courante', 'Classe': '35' },
    variants: [
      { label: 'Sac 50 kg', value: '50kg' },
    ],
    packaging: 'Sac de 50 kg',
    featured: true,
    popular: true,
    usage: 'Béton courant, mortier, enduit, dallage, fondations légères.',
  },
  {
    id: 'carrelage-gres-cerame',
    name: 'Carrelage Grès Cérame',
    slug: 'carrelage-gres-cerame',
    categoryId: 'carrelage',
    subcategory: 'Grès cérame',
    shortDescription: 'Carrelage sol et mur en grès cérame haute résistance. Finition mate ou brillante.',
    description: 'Carrelage en grès cérame de haute qualité, résistant à l\'usure et aux taches. Disponible en plusieurs formats et finitions pour sols et murs intérieurs/extérieurs.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    characteristics: { 'Type': 'Grès cérame', 'Usage': 'Sol & mur', 'Résistance': 'Haute', 'Entretien': 'Facile' },
    variants: [
      { label: '30×30 cm', value: '30x30' },
      { label: '40×40 cm', value: '40x40' },
      { label: '60×60 cm', value: '60x60' },
      { label: '60×120 cm', value: '60x120' },
    ],
    packaging: 'Carton',
    featured: true,
    popular: true,
    usage: 'Séjours, chambres, cuisines, salles de bain, terrasses.',
  },
  {
    id: 'betonniere-410l',
    name: 'Bétonnière 410 Litres',
    slug: 'betonniere-410-litres',
    categoryId: 'equipements',
    subcategory: 'Bétonnières',
    shortDescription: 'Bétonnière motorisée de 410 litres pour chantiers moyens et grands.',
    description: 'Bétonnière à bascule de capacité 410 litres, idéale pour les chantiers de taille moyenne à grande. Motorisation fiable et cuve robuste.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    ],
    characteristics: { 'Capacité': '410 litres', 'Type': 'Motorisée', 'Usage': 'Chantier', 'Cuve': 'Acier' },
    variants: [],
    packaging: 'Unité',
    badge: 'Équipement',
    featured: true,
    usage: 'Préparation de béton sur chantier, travaux de maçonnerie.',
  },
  {
    id: 'tôle-bac-alu',
    name: 'Tôle Bac Alu',
    slug: 'tôle-bac-alu',
    categoryId: 'toiture',
    subcategory: 'Tôles',
    shortDescription: 'Tôle de toiture profilée en aluminium. Légère et résistante.',
    description: 'Tôle de toiture en aluminium profilé bac. Légère, résistante à la corrosion et disponible en plusieurs couleurs et longueurs.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    characteristics: { 'Matière': 'Aluminium', 'Type': 'Bac', 'Usage': 'Toiture', 'Résistance': 'Corrosion' },
    variants: [
      { label: '1.80 m', value: '1.80' },
      { label: '2.40 m', value: '2.40' },
      { label: '3.00 m', value: '3.00' },
      { label: '3.60 m', value: '3.60' },
    ],
    packaging: 'Pièce',
    popular: true,
    usage: 'Couverture de toiture résidentielle et commerciale.',
  },
  {
    id: 'parpaing-15',
    name: 'Parpaing 15',
    slug: 'parpaing-15',
    categoryId: 'maconnerie',
    subcategory: 'Blocs creux',
    shortDescription: 'Bloc creux de 15 cm pour murs porteurs et cloisons.',
    description: 'Parpaing (bloc creux) de largeur 15 cm, utilisé pour la construction de murs porteurs et de cloisons. Bonne résistance mécanique.',
    image: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800&q=80',
    ],
    characteristics: { 'Largeur': '15 cm', 'Type': 'Bloc creux', 'Usage': 'Murs porteurs, cloisons' },
    variants: [],
    packaging: 'Unité',
    popular: true,
    usage: 'Murs porteurs, cloisons de séparation, murs de clôture.',
  },
  {
    id: 'lavabo-pedestal',
    name: 'Lavabo sur Pied',
    slug: 'lavabo-pedestal',
    categoryId: 'sanitaire',
    subcategory: 'Lavabos',
    shortDescription: 'Lavabo en céramique blanche avec pied. Design classique et épuré.',
    description: 'Lavabo en céramique de qualité, monté sur pied. Design classique adapté à toutes les salles de bain. Inclut le trop-plein.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    ],
    characteristics: { 'Matière': 'Céramique', 'Type': 'Sur pied', 'Couleur': 'Blanc', 'Trop-plein': 'Oui' },
    variants: [],
    packaging: 'Unité',
    usage: 'Salles de bain résidentielles et commerciales.',
  },
  {
    id: 'peinture-interieur',
    name: 'Peinture Intérieure Acrylique',
    slug: 'peinture-interieur-acrylique',
    categoryId: 'peinture',
    subcategory: 'Peintures intérieures',
    shortDescription: 'Peinture acrylique pour murs et plafonds intérieurs. Couvrance et durabilité.',
    description: 'Peinture acrylique de qualité professionnelle pour l\'intérieur. Excellente couvrance, séchage rapide et finition mate ou satinée.',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
    ],
    characteristics: { 'Type': 'Acrylique', 'Usage': 'Intérieur', 'Finition': 'Mate / Satinée', 'Séchage': '2 heures' },
    variants: [
      { label: '4 Litres', value: '4L' },
      { label: '10 Litres', value: '10L' },
      { label: '20 Litres', value: '20L' },
    ],
    packaging: 'Seau',
    usage: 'Murs et plafonds de salles de bain, chambres, séjours.',
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.categoryId === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured);
};

export const getPopularProducts = (): Product[] => {
  return products.filter(p => p.popular);
};

export const getRelatedProducts = (product: Product): Product[] => {
  return products.filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.popular)).slice(0, 4);
};
