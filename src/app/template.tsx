/**
 * Motion D — transition de page courte, sans écran de chargement (TDR §34).
 * @hopsyder
 */
"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/tokens";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      {children}
    </motion.div>
  );
}
