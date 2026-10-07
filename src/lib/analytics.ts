/**
 * Tracking des KPI (TDR §60) — envoie les événements dans `window.dataLayer`
 * (compatible GTM / GA4 / Plausible via tag manager). Aucun outil n'est imposé.
 * @hopsyder
 */

export type TrackEvent =
  | "whatsapp_click"
  | "phone_click"
  | "quote_add"
  | "quote_submit"
  | "search"
  | "search_no_result"
  | "product_view";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}
