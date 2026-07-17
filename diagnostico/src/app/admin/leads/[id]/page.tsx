import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { AnonymizeLeadButton } from "@/components/admin/AnonymizeLeadButton";

export default async function AdminLeadDetailPage({
  params,
}: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const store = getStore();
  const lead = store.getLead(id);
  if (!lead) notFound();

  store.recordAudit({ action: "lead_viewed", entityType: "lead", entityId: lead.id, detail: {} });

  const assessments = store.listAssessments().filter((a) => a.leadId === lead.id);

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/leads" className="text-xs uppercase tracking-[0.15em] text-ink-muted hover:text-ink">
          ← Leads
        </Link>
        <h1 className="mt-4 text-[length:var(--text-title)]">{lead.name}</h1>
        <GoldDivider className="my-8" />
      </div>

      <section className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p><span className="text-ink-muted">E-mail:</span> {lead.email}</p>
          <p><span className="text-ink-muted">WhatsApp:</span> {lead.whatsapp}</p>
          <p><span className="text-ink-muted">Empresa:</span> {lead.company ?? "—"}</p>
          <p><span className="text-ink-muted">Cargo:</span> {lead.role ?? "—"}</p>
          <p><span className="text-ink-muted">Segmento:</span> {lead.segment ?? "—"}</p>
          <p><span className="text-ink-muted">Cidade:</span> {lead.city ?? "—"}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="text-ink-muted">Temperatura:</span> <span className="text-accent">{lead.temperature}</span> ({lead.score} pts)</p>
          <p><span className="text-ink-muted">Origem:</span> {lead.utm.utm_source ?? "—"} / {lead.utm.utm_campaign ?? "—"}</p>
          <p><span className="text-ink-muted">Consentimento contato:</span> {lead.consentContact ? "Sim" : "Não"}</p>
          <p><span className="text-ink-muted">Consentimento marketing:</span> {lead.consentMarketing ? "Sim" : "Não"}</p>
          <p><span className="text-ink-muted">Criado em:</span> {new Date(lead.createdAt).toLocaleString("pt-BR")}</p>
          {lead.anonymizedAt && <p className="text-error">Anonimizado em {new Date(lead.anonymizedAt).toLocaleString("pt-BR")}</p>}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Diagnósticos deste lead
        </h2>
        <div className="mt-4 space-y-3">
          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/admin/diagnosticos/${a.id}`}
              className="block border border-line bg-surface p-4 text-sm hover:border-accent"
            >
              <span className="text-ink">{a.status}</span>
              <span className="ml-4 text-ink-muted">
                {a.overallScore !== undefined ? `nota ${a.overallScore}` : ""}
              </span>
              <span className="ml-4 text-ink-muted">
                {new Date(a.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </Link>
          ))}
          {assessments.length === 0 && <p className="text-sm text-ink-muted">Nenhum diagnóstico.</p>}
        </div>
      </section>

      {!lead.anonymizedAt && (
        <section className="border-t border-line pt-6">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-error">
            Zona de risco (LGPD)
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink-muted">
            Anonimiza nome, e-mail, WhatsApp e demais dados pessoais deste lead.
            Ação irreversível — use para atender solicitação de exclusão.
          </p>
          <div className="mt-4">
            <AnonymizeLeadButton leadId={lead.id} />
          </div>
        </section>
      )}
    </div>
  );
}
