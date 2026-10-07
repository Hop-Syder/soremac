# Skills retenus pour ce projet — @hopsyder

| Skill | Retenu | Usage concret dans le code |
|---|---|---|
| taste-skill (anti « AI slop ») | ✅ | Coins 3–4 px, pas de glassmorphism ni gradients décoratifs, grille catégories asymétrique, typographie condensée forte, accent ambre limité aux CTA/badges. |
| ui-ux-pro-max | ✅ | Échelle typo `clamp()`, spacing, cibles tactiles ≥ 44 px, états (vide, chargement, erreur, aucun résultat). |
| shadcn/ui (MCP) | ⚖️ principe | Remplacé par Radix Dialog + composants maison : même socle accessible, sans l'apparence brute de la librairie. |
| motion-framer | ✅ | `components/motion/tokens.ts` : un seul langage (reveal 18 px/0,6 s, stagger 65 ms, drawers 0,38 s). |
| gsap-skills | ✅ limité | Hero (timeline + parallax) et Services (sticky + ScrollTrigger) uniquement. |
| vercel react best practices | ✅ | Server Components par défaut, îles client minimales, `next/image` AVIF/WebP, SSG, `optimizePackageImports`. |
| 21st.dev magic | ❌ | Non nécessaire : aucun composant n'apportait de valeur supérieure au sur-mesure. |
| convex / react-native | ❌ | Hors périmètre (Supabase prévu pour le back-office ; pas d'app mobile native). |

## Motion par section (TDR §51)
Header shrink · Hero GSAP stagger + parallax · Réassurance reveal horizontal · Catégories stagger + zoom ·
Produits stagger + hover · Profils reveal horizontal · Pourquoi stagger · Services sticky ScrollTrigger ·
Sélection reveal · CTA subtle scale · Galerie crossfade + swipe · Filtres bottom-sheet · Devis drawer ·
Menu mobile slide-in · Dock mobile auto-rétractable · Barre d'action collante sur fiche produit.
Tout est neutralisé par `prefers-reduced-motion`.
