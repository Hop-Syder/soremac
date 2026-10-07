# SOREMAC — Catalogue digital premium (v2)

Refonte complète du site SOREMAC SARL selon le TDR « Vision 2026 ». — @hopsyder

## Stack
- **Next.js 16 (App Router, SSG)** — 44 pages pré-rendues, SEO produit/catégorie/local, JSON-LD (HardwareStore, Product, BreadcrumbList, Article), sitemap & robots.
- **Tailwind CSS v4** — design system « Comptoir industriel premium » (`src/app/globals.css`) : neutres pierre/béton, graphite, orange chantier réservé à l'action ; *Bricolage Grotesque* (titres) + *Geist* (texte) ; une échelle unique d'espacements (`.shell`, `.section`).
- **Phosphor Icons** (SVG, style duotone) — jeu d'icônes unique, aucun émoji.
- **Motion** — reveal, stagger, hover, drawers, onglets, galerie plein écran, header.
- **GSAP + ScrollTrigger** — réservé au Hero (timeline + parallax) et à la séquence Services (panneau collant).
- **Embla Carousel** — carrousel « produits à la une » et galerie produit (swipe tactile).
- **Lenis** — défilement fluide desktop (désactivé au tactile et en reduced-motion).
- **Radix Dialog** — drawers, recherche ⌘K, lightbox accessibles (focus trap, Échap, aria).

## Démarrer
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```
Variables : voir `.env.example`. Sans Supabase, les demandes de devis sont journalisées côté serveur.

## Architecture
```
src/lib/site.ts             NAP officiel (source unique)
src/lib/catalog/            types, catégories, produits, articles, moteur de recherche
src/lib/whatsapp.ts         messages WhatsApp contextualisés
src/lib/analytics.ts        événements KPI → window.dataLayer
src/components/motion/      langage de motion unique (tokens + Reveal/Stagger)
src/components/quote/       Devis Builder (provider persistant, drawer, formulaire)
src/components/product/     galerie + lightbox, configurateur de variantes
src/components/catalog/     ProductCard, CatalogExplorer (recherche + filtres)
src/lib/catalog/repo.ts     lecture catalogue (Supabase, repli sur le seed)
src/lib/admin/              auth, validation, lecture back-office
src/app/(site)/             site public
src/app/admin/              back-office (login, panel, actions serveur)
src/app/api/devis           réception devis/contact → Supabase
docs/                       choix des skills, schéma SQL
```

## Back-office `/admin`
Gestion du catalogue et des demandes, sans toucher au code (TDR §44).

| Écran | Fonctions |
|---|---|
| Tableau de bord | Demandes nouvelles / en cours, produits publiés / brouillons, fiches pauvres en images, import du catalogue initial |
| Produits | Recherche et filtres, publier / dépublier / archiver, « À la une » et « Populaire » en un clic |
| Fiche produit | Infos, galerie multi-vues (upload, texte alt, rôle, ordre), variantes, caractéristiques, contenu, PDF, produits associés, SEO avec aperçu Google |
| Catégories | Créer, modifier, réorganiser (ordre du site), taille de tuile homepage, catégories associées |
| Demandes | Statuts Nouveau → En traitement → Traité → Archivé, réponse WhatsApp / appel / email en un clic |

### Mise en service
1. Créer un projet Supabase, exécuter `docs/supabase-schema.sql` dans le SQL Editor (tables, RLS, bucket `catalogue`).
2. Définir les variables (`.env.example`) : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SECRET` (≥ 32 caractères, `openssl rand -base64 48`).
3. Se connecter sur `/admin` → **Importer le catalogue initial**.

Chaque modification invalide le cache : le site public est à jour immédiatement ; les nouvelles fiches et catégories sont rendues à la demande.
Sans Supabase, le site public utilise le catalogue embarqué et l'admin passe en **lecture seule**.

### Sécurité
- Session : cookie httpOnly signé HMAC-SHA256, 12 h, limité à `/admin` ; comparaison du mot de passe en temps constant, délai après échec.
- Chaque page **et chaque action serveur** vérifie la session ; toutes les saisies sont revalidées côté serveur.
- La clé `service_role` ne quitte jamais le serveur ; RLS n'autorise que la lecture publique du catalogue publié.
- Uploads : JPEG/PNG/WebP/AVIF/PDF, 8 Mo max. Back-office non indexé (`noindex`).

## À fournir par SOREMAC avant production
- Logo officiel (SVG) et **photographies produits** (les visuels Unsplash sont provisoires).
- Email officiel, données techniques détaillées par référence, fiches PDF.
- Le site n'invente jamais prix, stock ni certification : « Prix sur demande ».
