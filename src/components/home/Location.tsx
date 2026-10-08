/**
 * 12 — « Retrouvez-nous à Cotonou. » (TDR §18) — adresse, repère, carré, horaires visibles
 * sans aller sur la page Contact, + carte. Le statut « ouvert / fermé » est calculé à l'heure du Bénin.
 * @hopsyder
 */
"use client";

import { useEffect, useState } from "react";
import { ClockIcon, MapPinIcon, NavigationArrowIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import { SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/** Ouvert ? Lun–Ven 8–13 & 15–18, Sam 8–13 (Africa/Porto-Novo = UTC+1). */
function openNow(d = new Date()) {
  const bj = new Date(d.toLocaleString("en-US", { timeZone: "Africa/Porto-Novo" }));
  const day = bj.getDay();
  const m = bj.getHours() * 60 + bj.getMinutes();
  const inSlot = (a: number, b: number) => m >= a * 60 && m < b * 60;
  if (day >= 1 && day <= 5) return inSlot(8, 13) || inSlot(15, 18);
  if (day === 6) return inSlot(8, 13);
  return false;
}

export function Location() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => setOpen(openNow()), []);

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-line bg-white shadow-[var(--shadow-card)] lg:grid-cols-[1fr_1.2fr]">
      <Reveal className="p-7 md:p-10 lg:p-12">
        <h2 className="t-h2">Retrouvez-nous à Cotonou.</h2>

        <dl className="mt-8 grid gap-6">
          <div className="flex gap-4">
            <dt className="sr-only">Adresse</dt>
            <span data-m="pin" className="relative mt-0.5 grid size-6 shrink-0 place-items-center"><span data-ring aria-hidden className="absolute inset-0 rounded-full bg-accent/40 opacity-0" /><MapPinIcon size={24} weight="duotone" className="relative text-accent-2" /></span>
            <dd>
              <p className="font-semibold">{SITE.address.district} — Quartier {SITE.address.quarter}</p>
              <p className="text-steel">{SITE.address.landmark}</p>
              <p className="text-steel">{SITE.address.plot}</p>
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="sr-only">Horaires</dt>
            <ClockIcon size={24} weight="duotone" className="mt-0.5 shrink-0 text-accent-2" />
            <dd className="w-full">
              {open !== null && (
                <span className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${open ? "bg-emerald-50 text-emerald-700" : "bg-paper text-steel"}`}>
                  <span className={`size-1.5 rounded-full ${open ? "bg-emerald-500" : "bg-steel-2"}`} /> {open ? "Ouvert actuellement" : "Fermé actuellement"}
                </span>
              )}
              <ul data-m="rows" className="grid gap-1.5">
                {SITE.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-6 border-b border-dashed border-line pb-1.5 text-[15px]">
                    <span>{h.days}</span><span className="tabular text-steel">{h.slots}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href={SITE.mapsUrl} variant="dark"><NavigationArrowIcon size={18} weight="fill" /> Ouvrir dans Google Maps</ButtonLink>
          <ButtonLink href={SITE.phoneHref} variant="outline"><PhoneIcon size={18} /> Appeler</ButtonLink>
        </div>
      </Reveal>
      <div className="relative min-h-[340px] bg-paper-2">
        <iframe title="Carte — SOREMAC à Vedoko, Cotonou" src={SITE.mapsEmbed} loading="lazy" className="absolute inset-0 h-full w-full grayscale-[0.4]" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}
