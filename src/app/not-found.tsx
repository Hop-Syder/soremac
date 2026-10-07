/** 404 — renvoie vers le catalogue et le contact. @hopsyder */
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <main className="shell flex min-h-dvh flex-col items-start justify-center py-20">
      <Logo />
      <p className="tabular mt-12 font-display text-[clamp(6rem,18vw,11rem)] font-bold leading-none tracking-[-0.06em] text-accent">404</p>
      <h1 className="t-h1 mt-2">Cette page n'existe pas.</h1>
      <p className="t-lead mt-4 max-w-md">Le produit ou la page recherchée a peut-être changé d'adresse.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/produits" variant="dark">Explorer les produits</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Nous contacter</ButtonLink>
      </div>
    </main>
  );
}
