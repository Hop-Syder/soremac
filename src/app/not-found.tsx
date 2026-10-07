/** 404 — renvoie vers le catalogue et la recherche. @hopsyder */
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="tabular font-display text-[10rem] font-black leading-none text-accent">404</p>
      <h1 className="h-section mt-2">Cette page n'existe pas.</h1>
      <p className="mt-4 max-w-md text-steel">Le produit ou la page recherchée a peut-être changé d'adresse.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/produits">Explorer les produits</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Nous contacter</ButtonLink>
      </div>
    </section>
  );
}
