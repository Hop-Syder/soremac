/**
 * Racine du back-office : jamais indexée.
 * @hopsyder
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office SOREMAC" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="admin-ui min-h-dvh bg-paper">{children}</div>;
}
