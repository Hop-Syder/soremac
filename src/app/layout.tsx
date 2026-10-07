/**
 * Layout racine — polices et SEO global. Le shell public vit dans (site)/layout.tsx,
 * le back-office dans admin/layout.tsx.
 * @hopsyder
 */
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

// Titres : grotesque contemporaine à forte personnalité
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
// Texte & interface : très lisible, chiffres nets
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

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
  themeColor: "#14161a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${geist.variable}`} suppressHydrationWarning>
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
