/**
 * Galerie produit (TDR §25) — Motion F : glissé contrôlé, sans 3D.
 * Carrousel principal Embla (swipe mobile, glisser desktop) synchronisé avec les miniatures,
 * zoom au survol qui suit le curseur (desktop), plein écran au clic : ← → Échap, swipe, compteur.
 * @hopsyder
 */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, CornersOutIcon, XIcon } from "@phosphor-icons/react/ssr";
import type { ProductImage } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

const ROLE_LABEL: Record<string, string> = {
  main: "Vue principale", side: "Vue secondaire", detail: "Détail", packaging: "Packaging",
  texture: "Texture", dimensions: "Dimensions", usage: "Utilisation", site: "En chantier",
};

export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [mainRef, main] = useEmblaCarousel({ loop: images.length > 1 });
  const n = images.length;

  useEffect(() => {
    if (!main) return;
    const onSelect = () => setIndex(main.selectedScrollSnap());
    main.on("select", onSelect);
    return () => { main.off("select", onSelect); };
  }, [main]);

  const go = useCallback((i: number) => main?.scrollTo(i), [main]);
  const btn = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur transition-opacity hover:bg-white";

  if (!n) return <div className="aspect-square rounded-[24px] bg-paper-2" />;

  return (
    <div className="lg:sticky lg:top-28">
      <div className="group relative overflow-hidden rounded-[24px] border border-line bg-white">
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div key={img.src + i} className="relative aspect-square min-w-0 shrink-0 grow-0 basis-full">
                <button
                  className="absolute inset-0 cursor-zoom-in overflow-hidden"
                  onClick={() => setOpen(true)}
                  onMouseMove={(e) => {
                    if (i !== index || window.matchMedia("(pointer: coarse)").matches) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                  }}
                  onMouseLeave={() => setZoom(null)}
                  aria-label={`Agrandir l'image ${i + 1} sur ${n} : ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-300 ease-out"
                    style={zoom && i === index ? { transform: "scale(1.7)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {n > 1 && (
          <>
            <button onClick={() => main?.scrollPrev()} className={cn(btn, "left-4 opacity-0 group-hover:opacity-100 max-lg:hidden")} aria-label="Image précédente"><CaretLeftIcon size={18} weight="bold" /></button>
            <button onClick={() => main?.scrollNext()} className={cn(btn, "right-4 opacity-0 group-hover:opacity-100 max-lg:hidden")} aria-label="Image suivante"><CaretRightIcon size={18} weight="bold" /></button>
          </>
        )}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
            {images[index]?.role ? ROLE_LABEL[images[index].role!] : `Vue ${index + 1}`}
          </span>
          <span className="flex items-center gap-2">
            <span className="tabular rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">{index + 1} / {n}</span>
            <span className="grid size-8 place-items-center rounded-full bg-white/90 shadow-sm max-lg:hidden"><CornersOutIcon size={15} weight="bold" /></span>
          </span>
        </div>
      </div>

      {n > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" aria-label="Miniatures">
          {images.map((img, i) => (
            <li key={img.src + i} className="shrink-0">
              <button
                onClick={() => go(i)}
                aria-current={i === index}
                aria-label={`Voir l'image ${i + 1} : ${img.alt}`}
                className={cn("relative block size-[72px] overflow-hidden rounded-[12px] border-2 bg-paper-2 transition-all sm:size-20", i === index ? "border-ink" : "border-transparent opacity-60 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox images={images} index={index} open={open} onOpenChange={setOpen} onIndex={(i) => go(i)} name={name} />
    </div>
  );
}

function Lightbox({ images, index, open, onOpenChange, onIndex, name }: { images: ProductImage[]; index: number; open: boolean; onOpenChange: (o: boolean) => void; onIndex: (i: number) => void; name: string }) {
  const n = images.length;
  const [i, setI] = useState(index);
  const [dir, setDir] = useState(1);
  useEffect(() => { if (open) setI(index); }, [open, index]);
  const nav = useCallback((d: number) => { setDir(d); setI((x) => { const nx = (x + d + n) % n; onIndex(nx); return nx; }); }, [n, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") nav(1); if (e.key === "ArrowLeft") nav(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nav]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/95 backdrop-blur" />
        <Dialog.Content className="fixed inset-0 z-[91] flex flex-col outline-none">
          <Dialog.Title className="sr-only">Galerie — {name}</Dialog.Title>
          <Dialog.Description className="sr-only">Flèches gauche et droite pour naviguer, Échap pour fermer.</Dialog.Description>
          <div className="flex items-center justify-between gap-4 p-4 text-white">
            <span className="tabular truncate text-sm text-white/70">{i + 1} / {n} — {images[i]?.alt}</span>
            <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Fermer"><XIcon size={20} /></Dialog.Close>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <motion.div
              key={i}
              className="absolute inset-4 md:inset-10"
              initial={{ opacity: 0, x: dir * 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag={n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (info.offset.x < -60) nav(1); else if (info.offset.x > 60) nav(-1); }}
            >
              <Image src={images[i]?.src ?? ""} alt={images[i]?.alt ?? ""} fill sizes="100vw" className="object-contain" draggable={false} />
            </motion.div>
            {n > 1 && (
              <>
                <button onClick={() => nav(-1)} className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Image précédente"><CaretLeftIcon size={20} weight="bold" /></button>
                <button onClick={() => nav(1)} className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Image suivante"><CaretRightIcon size={20} weight="bold" /></button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
