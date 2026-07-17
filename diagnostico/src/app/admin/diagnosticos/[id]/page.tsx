import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { AssessmentActions } from "@/components/admin/AssessmentActions";

export default async function AdminDiagnosticoDetailPage({
  params,
}: PageProps<"/admin/diagnosticos/[id]">) {
  const { id } = await params;
  const store = getStore();
  const assessment = store.getAssessment(id);
  if (!assessment) notFound();

  const lead = store.getLead(assessment.leadId);
  const image = store.getImageByAssessment(id);
  const payments = store.getPaymentsByAssessment(id);

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/diagnosticos"
          className="text-xs uppercase tracking-[0.15em] text-ink-muted hover:text-ink"
        >
          ← Diagnósticos
        </Link>
        <h1 className="mt-4 text-[length:var(--text-title)]">
          {lead ? (
            <Link href={`/admin/leads/${lead.id}`} className="hover:text-accent hover:underline">
              {lead.name}
            </Link>
          ) : (
            assessment.leadId
          )}
        </h1>
        <GoldDivider className="my-8" />
      </div>

      <section className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p><span className="text-ink-muted">Status:</span> {assessment.status}</p>
          <p><span className="text-ink-muted">Nota geral:</span> {assessment.overallScore ?? "—"}</p>
          <p><span className="text-ink-muted">Provedor de IA:</span> {assessment.aiProvider ?? "—"} / {assessment.aiModel ?? "—"}</p>
          <p><span className="text-ink-muted">Versão do prompt:</span> {assessment.promptVersion ?? "—"}</p>
          <p><span className="text-ink-muted">Processado em:</span> {assessment.processedAt ? new Date(assessment.processedAt).toLocaleString("pt-BR") : "—"}</p>
          <p><span className="text-ink-muted">Liberado em:</span> {assessment.releasedAt ? new Date(assessment.releasedAt).toLocaleString("pt-BR") : "—"}</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Fotografia</p>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/admin/assessments/${id}/photo`}
              alt="Fotografia enviada pelo lead"
              className="max-h-64 border border-line"
            />
          ) : (
            <p className="text-sm text-ink-muted">Sem fotografia (excluída ou não enviada).</p>
          )}
        </div>
      </section>

      {payments.length > 0 && (
        <section>
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
            Pagamentos
          </h2>
          <div className="mt-4 space-y-2 text-sm text-ink-muted">
            {payments.map((p) => (
              <p key={p.id}>
                {p.provider} — {p.status} — {(p.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line pt-6">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">Ações</h2>
        <div className="mt-4">
          <AssessmentActions assessmentId={id} hasImage={!!image} status={assessment.status} />
        </div>
      </section>
    </div>
  );
}
