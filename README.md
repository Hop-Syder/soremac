# SOREMAC — Catalogue digital premium (v2)

Refonte complète du site SOREMAC SARL selon le TDR « Vision 2026 ». — @hopsyder

## Stack
- **Next.js 16 (App Router, SSG)** — 44 pages pré-rendues, SEO produit/catégorie/local, JSON-LD (HardwareStore, Product, BreadcrumbList, Article), sitemap & robots.
- **Tailwind CSS v4** — design system « Industrial Premium » (`src/app/globals.css`).
- **Motion** — reveal, stagger, hover, drawers, galerie, transitions de page, header.
- **GSAP + ScrollTrigger** — réservé au Hero et à la séquence Services (sticky).
- **Radix Dialog** — drawers / lightbox accessibles (focus trap, Échap, aria).

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
src/app/api/devis           réception devis/contact → Supabase
docs/                       choix des skills, schéma SQL
```

## À fournir par SOREMAC avant production
- Logo officiel (SVG) et **photographies produits** (les visuels Unsplash sont provisoires).
- Email officiel, données techniques détaillées par référence, fiches PDF.
- Le site n'invente jamais prix, stock ni certification : « Prix sur demande ».
