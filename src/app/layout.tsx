/**
 * Layout racine — polices et SEO global. Le shell public vit dans (site)/layout.tsx,
 * le back-office dans admin/layout.tsx.
 * @hopsyder
 */
import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

// Titres : sans-serif architecturale, légèrement condensée (axe wdth)
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
// Texte : très lisible
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SOREMAC — Matériaux de construction à Cotonou, Bénin",
    template: "%s | SOREMAC Cotonou",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "matériaux de construction Cotonou",
    "ciment Cotonou",
    "fer à béton Cotonou",
    "carrelage Cotonou",
    "quincaillerie Cotonou",
    "matériaux BTP Bénin",
    "Sika Cotonou",
    "bétonnière Cotonou",
  ],
  openGraph: { type: "website", locale: "fr_BJ", siteName: SITE.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#121314",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Marque la présence de JS avant le premier rendu (évite le flash du Hero) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
