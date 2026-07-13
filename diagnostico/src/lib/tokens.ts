import "server-only";
import { randomBytes } from "crypto";

/**
 * Token público de acesso ao assessment.
 * 32 bytes aleatórios, url-safe, não previsível, sem informação embutida.
 */
export function generatePublicToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Formato esperado de um token válido (evita hits desnecessários no banco). */
export function isValidTokenFormat(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}
