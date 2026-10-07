/**
 * Galerie produit (TDR §25) — Motion F : crossfade contrôlé, sans 3D.
 * Desktop : grande image + miniatures, zoom au survol qui suit le curseur, lightbox au clic.
 * Mobile  : carrousel swipe natif (scroll-snap) + indicateurs.
 * Lightbox : plein écran, précédent/suivant, clavier (← → Échap), swipe.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ProductImage } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const n = images.length;
  const go = useCallback((i: number) => setIndex((i + n) % n), [n]);

  // Mobile : synchronise l'index avec la position du carrousel
  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="lg:sticky lg:top-24">
      {/* Mobile — swipe */}
      <div className="relative -mx-4 sm:-mx-6 lg:hidden">
        <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.src + i} onClick={() => { setIndex(i); setOpen(true); }} className="relative aspect-square w-full shrink-0 snap-center bg-paper-2" aria-label={`Agrandir l'image ${i + 1} sur ${n}`}>
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {n > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
            {images.map((_, i) => (
              <span key={i} className={cn("h-1 rounded-full bg-paper transition-all duration-300", i === index ? "w-6 opacity-100" : "w-1.5 opacity-60")} />
            ))}
          </div>
        )}
        <span className="tabular absolute right-3 top-3 bg-ink/70 px-2 py-0.5 text-xs text-paper">{index + 1} / {n}</span>
      </div>

      {/* Desktop — image principale + miniatures */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[84px_1fr]">
        <ul className="flex flex-col gap-2" aria-label="Miniatures">
          {images.map((img, i) => (
            <li key={img.src + i}>
              <button
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={`Voir l'image ${i + 1} : ${img.alt}`}
                className={cn("relative block aspect-square w-full overflow-hidden bg-paper-2 outline-offset-2 transition", i === index ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <button
          className="group relative aspect-[4/5] max-h-[78vh] w-full cursor-zoom-in overflow-hidden bg-paper-2 xl:aspect-square"
          onClick={() => setOpen(true)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          aria-label="Ouvrir la galerie plein écran"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <Image
                src={images[index].src}
                alt={images[index].alt}
                fill
                priority={index === 0}
                sizes="(min-width:1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(1.6)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>
          <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-paper/90 px-3 py-2 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
            <Expand size={14} /> Plein écran
          </span>
        </button>
      </div>

      <Lightbox images={images} index={index} open={open} onOpenChange={setOpen} go={go} name={name} />
    </div>
  );
}

function Lightbox({ images, index, open, onOpenChange, go, name }: { images: ProductImage[]; index: number; open: boolean; onOpenChange: (o: boolean) => void; go: (i: number) => void; name: string }) {
  const [dir, setDir] = useState(1);
  const nav = useCallback((d: number) => { setDir(d); go(index + d); }, [go, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nav]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/95" />
        <Dialog.Content className="fixed inset-0 z-[91] flex flex-col outline-none">
          <Dialog.Title className="sr-only">Galerie — {name}</Dialog.Title>
          <Dialog.Description className="sr-only">Utilisez les flèches du clavier pour naviguer.</Dialog.Description>
          <div className="flex items-center justify-between p-4 text-paper">
            <span className="tabular text-sm">{index + 1} / {images.length} — {images[index].alt}</span>
            <Dialog.Close className="grid size-11 place-items-center rounded-full hover:bg-paper/10" aria-label="Fermer"><X /></Dialog.Close>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                className="absolute inset-0"
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => { if (info.offset.x < -60) nav(1); else if (info.offset.x > 60) nav(-1); }}
              >
                <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="object-contain" draggable={false} />
              </motion.div>
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={() => nav(-1)} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20" aria-label="Image précédente"><ChevronLeft /></button>
                <button onClick={() => nav(1)} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20" aria-label="Image suivante"><ChevronRight /></button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
