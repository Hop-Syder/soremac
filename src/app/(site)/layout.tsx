/**
 * Shell du site public : header, footer, Devis Builder, navigation mobile, LocalBusiness JSON-LD.
 * @hopsyder
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileDock } from "@/components/layout/MobileDock";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { QuoteDrawer } from "@/components/quote/QuoteDrawer";
import { JsonLd, localBusinessLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuoteProvider>
      <JsonLd data={localBusinessLd()} />
      <Header />
      <main id="contenu" className="min-h-dvh">{children}</main>
      <Footer />
      <QuoteDrawer />
      <MobileDock />
    </QuoteProvider>
  );
}
