import "server-only";
import { config } from "@/lib/config";
import { getStore } from "@/lib/db";

/**
 * Configurações editáveis pelo admin, com fallback para os defaults do .env.
 * Em produção (Supabase), isto lerá a tabela app_settings da mesma forma.
 */
export type EffectiveSettings = {
  fullReportPriceCents: number;
  bookingUrl: string;
  whatsappNumber: string;
  imageRetentionDays: number;
  checkoutEnabled: boolean;
};

export function getEffectiveSettings(): EffectiveSettings {
  const overrides = getStore().getSettings();
  return {
    fullReportPriceCents: overrides.fullReportPriceCents ?? config.FULL_REPORT_PRICE_CENTS,
    bookingUrl: overrides.bookingUrl ?? config.NEXT_PUBLIC_BOOKING_URL,
    whatsappNumber: overrides.whatsappNumber ?? config.NEXT_PUBLIC_WHATSAPP_NUMBER,
    imageRetentionDays: overrides.imageRetentionDays ?? config.IMAGE_RETENTION_DAYS,
    checkoutEnabled: overrides.checkoutEnabled ?? true,
  };
}

export function formatPriceBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
