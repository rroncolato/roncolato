"use client";

/**
 * Utilitários da jornada no navegador.
 * Guarda apenas o token e o rascunho de respostas — NUNCA a foto.
 */

const TOKEN_KEY = "diagnostico:token";
const DRAFT_KEY = "diagnostico:draft";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getDraft<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setDraft(draft: unknown) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

/** Captura UTM da URL atual (uma vez, na entrada). */
export function captureUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  utm.landing_page = window.location.pathname;
  const ref = params.get("ref") || params.get("indicacao");
  if (ref) utm.referral_code = ref;
  return utm;
}

export async function sendEvent(event: string, token?: string | null) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, token: token ?? undefined }),
      keepalive: true,
    });
  } catch {
    // analytics silencioso
  }
}
