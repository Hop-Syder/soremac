/**
 * Authentification du back-office.
 * Mot de passe unique (ADMIN_PASSWORD) → cookie de session signé HMAC-SHA256 (ADMIN_SECRET),
 * httpOnly, SameSite=Lax, Secure en production, durée 12 h.
 * Chaque page ET chaque action serveur appelle requireAdmin() : aucune route n'est protégée
 * uniquement par l'interface.
 * @hopsyder
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "soremac_admin";
const TTL_MS = 12 * 60 * 60 * 1000;

export const isAuthConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length >= 32);

const sign = (payload: string) => createHmac("sha256", process.env.ADMIN_SECRET!).update(payload).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
};

/** Compare le mot de passe en temps constant (hash HMAC des deux côtés → longueurs égales). */
export function checkPassword(input: string) {
  if (!isAuthConfigured()) return false;
  return safeEqual(sign(`pw:${input}`), sign(`pw:${process.env.ADMIN_PASSWORD}`));
}

export async function createSession() {
  const exp = String(Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: TTL_MS / 1000,
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  if (!isAuthConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

/** Garde à appeler en tête de chaque page et action serveur du back-office. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
