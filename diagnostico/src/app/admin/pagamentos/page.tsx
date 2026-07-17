import Link from "next/link";
import { getStore } from "@/lib/db";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { formatPriceBRL } from "@/lib/settings";

export default function AdminPagamentosPage() {
  const store = getStore();
  const payments = store.listPayments();
  const assessmentsById = new Map(store.listAssessments().map((a) => [a.id, a]));
  const leadsById = new Map(store.listLeads().map((l) => [l.id, l]));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Painel administrativo</p>
        <h1 className="mt-2 text-[length:var(--text-title)]">Pagamentos</h1>
        <GoldDivider className="my-8" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="py-3 pr-4">Lead</th>
              <th className="py-3 pr-4">Provedor</th>
              <th className="py-3 pr-4">Valor</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">ID externo</th>
              <th className="py-3 pr-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const assessment = assessmentsById.get(p.assessmentId);
              const lead = assessment ? leadsById.get(assessment.leadId) : undefined;
              return (
                <tr key={p.id} className="border-b border-line/50">
                  <td className="py-3 pr-4">
                    {lead ? (
                      <Link
                        href={`/admin/diagnosticos/${p.assessmentId}`}
                        className="text-ink hover:text-accent hover:underline"
                      >
                        {lead.name}
                      </Link>
                    ) : (
                      p.assessmentId
                    )}
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{p.provider}</td>
                  <td className="py-3 pr-4 text-ink-muted">{formatPriceBRL(p.amountCents)}</td>
                  <td className="py-3 pr-4">
                    <span className={p.status === "approved" ? "text-accent" : "text-ink-muted"}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{p.externalId ?? "—"}</td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              );
            })}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ink-muted">
                  Nenhum pagamento ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
