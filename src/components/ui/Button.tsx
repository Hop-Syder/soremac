/**
 * Bouton du design system — un nombre limité de variantes pour garder une hiérarchie claire (TDR §55).
 * Rendu en <Link>, <a> externe ou <button> selon les props.
 * @hopsyder
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-2",
  dark: "bg-ink text-paper hover:bg-ink-3",
  outline: "border border-current/25 text-current hover:border-current hover:bg-current/5",
  ghost: "text-current underline-offset-4 hover:underline px-0!",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
  light: "bg-paper text-ink hover:bg-white",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

interface Base {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2.5 rounded-[3px] font-semibold tracking-tight",
    "transition-[background-color,border-color,transform,filter] duration-200 ease-out active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
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
