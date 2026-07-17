"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import type { EffectiveSettings } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: EffectiveSettings }) {
  const router = useRouter();
  const [priceReais, setPriceReais] = useState(String(initial.fullReportPriceCents / 100));
  const [bookingUrl, setBookingUrl] = useState(initial.bookingUrl);
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [retentionDays, setRetentionDays] = useState(String(initial.imageRetentionDays));
  const [checkoutEnabled, setCheckoutEnabled] = useState(initial.checkoutEnabled);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const priceCents = Math.round(Number(priceReais.replace(",", ".")) * 100);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullReportPriceCents: priceCents,
        bookingUrl,
        whatsappNumber,
        imageRetentionDays: Number(retentionDays),
        checkoutEnabled,
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-6">
      <TextField
        label="Preço do relatório completo (R$)"
        value={priceReais}
        onChange={(e) => setPriceReais(e.target.value)}
        inputMode="decimal"
      />
      <TextField
        label="URL de agendamento (Sessão Estratégica)"
        value={bookingUrl}
        onChange={(e) => setBookingUrl(e.target.value)}
        placeholder="https://calendly.com/..."
      />
      <TextField
        label="WhatsApp (só números, com DDI)"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        placeholder="5562985928423"
      />
      <TextField
        label="Retenção de imagens (dias)"
        value={retentionDays}
        onChange={(e) => setRetentionDays(e.target.value)}
        inputMode="numeric"
      />
      <label className="flex items-center gap-3 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={checkoutEnabled}
          onChange={(e) => setCheckoutEnabled(e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Checkout ativo (desmarque para pausar vendas do relatório completo)
      </label>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar configurações"}
        </Button>
        {saved && <span className="text-sm text-accent">Salvo.</span>}
      </div>
    </form>
  );
}
