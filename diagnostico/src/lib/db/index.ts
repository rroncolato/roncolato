import "server-only";
import { isDemoMode } from "@/lib/config";
import { getDemoStore, type DemoStore } from "./demo-store";

/**
 * Ponto único de acesso a dados.
 * DEMO_MODE → store JSON local. Produção → implementação Supabase (Fase 3+).
 */
export function getStore(): DemoStore {
  if (isDemoMode) return getDemoStore();
  // Implementação Supabase entra aqui quando credenciais forem configuradas.
  throw new Error(
    "Store Supabase ainda não implementado — use DEMO_MODE=true ou configure na Fase 3.",
  );
}
