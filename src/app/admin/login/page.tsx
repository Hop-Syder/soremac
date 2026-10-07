/**
 * Connexion au back-office.
 * @hopsyder
 */
import { redirect } from "next/navigation";
import { isAdmin, isAuthConfigured } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/layout/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-dvh place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <Logo tone="light" />
        <div className="mt-8 bg-paper p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold uppercase">Back-office</h1>
          <p className="mt-1 text-sm text-steel">Catalogue, catégories et demandes de devis.</p>
          <div className="mt-6">
            <LoginForm configured={isAuthConfigured()} />
          </div>
        </div>
      </div>
    </div>
  );
}
