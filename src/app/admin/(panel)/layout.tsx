/**
 * Shell protégé du back-office : vérifie la session, affiche la navigation
 * et signale si Supabase n'est pas configuré (mode lecture seule).
 * @hopsyder
 */
import { requireAdmin } from "@/lib/admin/auth";
import { quoteCounts } from "@/lib/admin/data";
import { isDbConfigured } from "@/lib/db/supabase";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/layout/Logo";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await quoteCounts().catch(() => null);

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-30 bg-ink lg:h-dvh">
        <div className="hidden px-6 py-6 lg:block">
          <Logo tone="light" />
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-paper/40">Back-office</p>
        </div>
        <AdminNav newQuotes={counts?.nouveau ?? 0} />
      </aside>
      <div className="min-w-0">
        {!isDbConfigured() && (
          <p className="border-b border-accent/40 bg-accent/15 px-6 py-2.5 text-sm">
            <strong>Mode lecture seule</strong> — Supabase n'est pas configuré : vous consultez le catalogue initial. Renseignez
            <code className="mx-1 bg-white px-1">SUPABASE_URL</code> et <code className="mx-1 bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code> pour activer l'édition.
          </p>
        )}
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
