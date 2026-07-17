import { getEffectiveSettings } from "@/lib/settings";
import { isDemoMode } from "@/lib/config";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default function AdminConfiguracoesPage() {
  const settings = getEffectiveSettings();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Painel administrativo</p>
        <h1 className="mt-2 text-[length:var(--text-title)]">Configurações</h1>
        <GoldDivider className="my-8" />
      </div>

      {isDemoMode && (
        <p className="border border-line bg-surface p-4 text-xs text-ink-muted">
          Modo de demonstração ativo. Pagamento simulado e IA por fixture —
          nenhuma cobrança ou chamada externa real acontece.
        </p>
      )}

      <SettingsForm initial={settings} />
    </div>
  );
}
