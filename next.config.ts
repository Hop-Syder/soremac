/**
 * Configuration Next.js — SOREMAC
 * @hopsyder
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF puis WebP : formats modernes servis automatiquement (TDR §46)
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Médias téléversés depuis le back-office (Supabase Storage, bucket public « catalogue »)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    // Upload d'images depuis le back-office via Server Actions
    serverActions: { bodySizeLimit: "10mb" },
    // Réduit le JS envoyé pour les librairies d'icônes et de motion
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
