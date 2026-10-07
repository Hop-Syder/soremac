/**
 * Shell du site public : header, footer, recherche rapide, Devis Builder, dock mobile,
 * défilement fluide et données structurées LocalBusiness.
 * @hopsyder
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileDock } from "@/components/layout/MobileDock";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { QuoteDrawer } from "@/components/quote/QuoteDrawer";
import { SearchProvider } from "@/components/search/SearchProvider";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { getCatalog } from "@/lib/catalog/repo";
import { JsonLd, localBusinessLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { products } = await getCatalog();
  return (
    <QuoteProvider>
      <SearchProvider products={products}>
        <JsonLd data={localBusinessLd()} />
        <SmoothScroll />
        <Header />
        <main id="contenu" className="min-h-dvh">{children}</main>
        <Footer />
        <QuoteDrawer />
        <MobileDock />
      </SearchProvider>
    </QuoteProvider>
  );
}
