/**
 * Bouton du design system — 5 variantes, 3 tailles, hiérarchie claire (TDR §55).
 * primary = orange chantier (action principale), dark = graphite, outline, ghost, whatsapp.
 * Rendu en <Link>, <a> externe ou <button>.
 * @hopsyder
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-2 hover:text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset]",
  dark: "bg-ink text-white hover:bg-ink-3",
  outline: "border border-current/20 text-current hover:border-current/60 hover:bg-current/[0.04]",
  ghost: "text-current hover:bg-current/[0.06]",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
  light: "bg-white text-ink hover:bg-paper",
};
const sizes: Record<Size, string> = {
  sm: "h-10 gap-2 px-4 text-[14px]",
  md: "h-12 gap-2.5 px-5 text-[15px]",
  lg: "h-14 gap-3 px-7 text-[16px]",
};

interface Base {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "group/btn relative inline-flex select-none items-center justify-center rounded-[10px] font-semibold tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,color,border-color,transform,filter] duration-200 ease-out active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-45",
    styles[variant],
    sizes[size],
    className,
  );

export function Button({ variant, size, className, ...rest }: Base & ComponentProps<"button">) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  external,
  ...rest
}: Base & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = buttonClass(variant, size, className);
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:"))
    return <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest} />;
  return <Link href={href} className={cls} {...rest} />;
}
