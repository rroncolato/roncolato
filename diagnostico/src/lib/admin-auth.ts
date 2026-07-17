import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { config, isDemoMode } from "@/lib/config";

/**
 * Autenticação do painel /admin.
 * DEMO_MODE: sessão local via cookie HMAC-assinado (email+expiração+APP_SECRET).
 * Produção: Supabase Auth assume este papel (troca isolada em admin-auth.ts).
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

function sign(payload: string): string {
  return createHmac("sha256", config.APP_SECRET || "insecure-dev-secret")
    .update(payload)
    .digest("hex");
}

export function createAdminSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${email}|${expiresAt}`;
  return `${payload}|${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split("|");
  if (parts.length !== 3) return false;
  const [email, expiresAtRaw, signature] = parts;
  const payload = `${email}|${expiresAtRaw}`;
  const expected = sign(payload);

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return email.toLowerCase() === config.ADMIN_EMAIL.toLowerCase();
}

export function validateAdminCredentials(email: string, password: string): boolean {
  if (!isDemoMode) return false; // fora de demo, Supabase Auth assume
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) return false;
  return (
    email.toLowerCase() === config.ADMIN_EMAIL.toLowerCase() &&
    password === config.ADMIN_PASSWORD
  );
}
