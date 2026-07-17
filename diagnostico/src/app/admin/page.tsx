import { getStore } from "@/lib/db";
import { formatPriceBRL } from "@/lib/settings";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default function AdminOverviewPage() {
  const store = getStore();
  const leads = store.listLeads();
  const assessments = store.listAssessments();
  const payments = store.listPayments();
  const events = store.listEvents();

  const completed = assessments.filter((a) =>
    ["free_ready", "paid"].includes(a.status),
  ).length;
  const paid = assessments.filter((a) => a.status === "paid").length;
  const failed = assessments.filter((a) => a.status === "failed").length;
  const revenueCents = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amountCents, 0);
  const conversionRate = completed > 0 ? Math.round((paid / completed) * 100) : 0;
  const bookingClicks = events.filter((e) => e.eventName === "booking_clicked").length;
  const qualifiedLeads = leads.filter((l) =>
    ["qualificado", "oportunidade"].includes(l.temperature),
  ).length;

  const funnelSteps: Array<[string, number]> = [
    ["Visitas à landing", events.filter((e) => e.eventName === "landing_view").length],
    ["Leads capturados", leads.length],
    ["Questionários concluídos", events.filter((e) => e.eventName === "questionnaire_completed").length],
    ["Fotos enviadas", events.filter((e) => e.eventName === "photo_uploaded").length],
    ["Diagnósticos concluídos", completed],
    ["Checkouts iniciados", events.filter((e) => e.eventName === "checkout_started").length],
    ["Pagamentos aprovados", paid],
    ["Cliques em agendamento", bookingClicks],
  ];

  return (
    <div className="space-y-12">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Painel administrativo</p>
        <h1 className="mt-2 text-[length:var(--text-title)]">Visão geral</h1>
        <GoldDivider className="my-8" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard label="Diagnósticos" value={assessments.length} />
        <AdminMetricCard label="Concluídos" value={completed} />
        <AdminMetricCard label="Pagos" value={paid} />
        <AdminMetricCard label="Receita" value={formatPriceBRL(revenueCents)} />
        <AdminMetricCard label="Conversão gratuito → pago" value={`${conversionRate}%`} />
        <AdminMetricCard label="Cliques em agendamento" value={bookingClicks} />
        <AdminMetricCard label="Leads qualificados" value={qualifiedLeads} />
        <AdminMetricCard label="Erros de análise" value={failed} />
      </div>

      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Funil
        </h2>
        <div className="mt-6 space-y-3">
          {funnelSteps.map(([label, count]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-ink-muted">{label}</span>
              <span className="font-display text-lg text-ink">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
