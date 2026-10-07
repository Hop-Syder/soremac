/**
 * Motion G — Drawer (TDR §33–34) : devis, filtres mobile, menu mobile.
 * Radix Dialog fournit focus-trap, Échap, aria ; Motion gère translateX/Y + opacity.
 * side="bottom" → bottom-sheet mobile (TDR §42).
 * @hopsyder
 */
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion/tokens";

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  side?: "right" | "left" | "bottom";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const off = side === "bottom" ? { y: "100%" } : { x: side === "right" ? "100%" : "-100%" };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={description ? undefined : undefined}>
              <motion.div
                className={cn(
                  "fixed z-[61] flex flex-col bg-paper shadow-2xl outline-none",
                  side === "bottom"
                    ? "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-xl"
                    : cn("inset-y-0 w-full sm:max-w-[460px]", side === "right" ? "right-0" : "left-0"),
                  className,
                )}
                initial={reduce ? { opacity: 0 } : { ...off, opacity: 0.6 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { ...off, opacity: 0.6 }}
                transition={{ duration: 0.38, ease: EASE }}
                drag={side === "bottom" && !reduce ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 600) onOpenChange(false);
                }}
              >
                {side === "bottom" && <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" aria-hidden />}
                <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                  <div>
                    <Dialog.Title className="font-display text-2xl font-bold uppercase">{title}</Dialog.Title>
                    {description ? (
                      <Dialog.Description className="mt-1 text-sm text-steel">{description}</Dialog.Description>
                    ) : (
                      <Dialog.Description className="sr-only">{title}</Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close className="-mr-2 grid size-11 place-items-center rounded-full text-steel transition-colors hover:bg-paper-2 hover:text-ink" aria-label="Fermer">
                    <X size={20} />
                  </Dialog.Close>
                </header>
                <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
                {footer && <footer className="border-t border-line bg-paper px-5 py-4 pb-safe sm:px-6">{footer}</footer>}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
