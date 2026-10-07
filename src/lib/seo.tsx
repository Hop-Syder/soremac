/**
 * Helpers SEO : JSON-LD (LocalBusiness, BreadcrumbList, Product, Article).
 * Les données Product n'incluent ni prix ni stock tant qu'ils ne sont pas fournis (TDR §40).
 * @hopsyder
 */
import { SITE } from "./site";
import type { Article, Product } from "./catalog/types";
import { productUrl } from "./catalog/products";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const localBusinessLd = () => ({
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: String(SITE.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.plot}, ${SITE.address.landmark}, ${SITE.address.quarter}`,
    addressLocality: `${SITE.address.district}, ${SITE.address.city}`,
    addressCountry: SITE.address.countryCode,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "13:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
  ],
  paymentAccepted: SITE.payments.join(", "),
  areaServed: ["Cotonou", "Bénin"],
});

export const breadcrumbLd = (items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.href}` })),
});

export const productLd = (p: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.summary,
  image: p.gallery.map((g) => g.src),
  url: `${SITE.url}${productUrl(p)}`,
  ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
  category: p.subcategory,
});

export const articleLd = (a: Article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.excerpt,
  image: a.image,
  author: { "@type": "Organization", name: SITE.name },
  publisher: { "@type": "Organization", name: SITE.name },
});
