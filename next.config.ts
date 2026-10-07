/**
 * Configuration Next.js — SOREMAC
 * @hopsyder
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF puis WebP : formats modernes servis automatiquement (TDR §46)
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // Réduit le JS envoyé pour les librairies d'icônes et de motion
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
