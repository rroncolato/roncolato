import Link from "next/link";
import { getStore } from "@/lib/db";
import { GoldDivider } from "@/components/ui/GoldDivider";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  answering: "Respondendo",
  photo_pending: "Aguardando foto",
  processing: "Processando",
  free_ready: "Gratuito pronto",
  paid: "Pago",
  failed: "Falhou",
  deleted: "Excluído",
};

export default function AdminDiagnosticosPage() {
  const store = getStore();
  const assessments = store.listAssessments();
  const leadsById = new Map(store.listLeads().map((l) => [l.id, l]));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Painel administrativo</p>
        <h1 className="mt-2 text-[length:var(--text-title)]">Diagnósticos</h1>
        <GoldDivider className="my-8" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="py-3 pr-4">Lead</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Nota</th>
              <th className="py-3 pr-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => {
              const lead = leadsById.get(a.leadId);
              return (
                <tr key={a.id} className="border-b border-line/50">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/diagnosticos/${a.id}`}
                      className="text-ink hover:text-accent hover:underline"
                    >
                      {lead?.name ?? a.leadId}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {STATUS_LABELS[a.status] ?? a.status}
                    {a.failureReason && (
                      <span className="ml-2 text-error">({a.failureReason})</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{a.overallScore ?? "—"}</td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              );
            })}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-muted">
                  Nenhum diagnóstico ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
