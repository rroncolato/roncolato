import Link from "next/link";
import { getStore } from "@/lib/db";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";

const TEMPERATURE_LABELS: Record<string, string> = {
  frio: "Frio",
  morno: "Morno",
  qualificado: "Qualificado",
  oportunidade: "Oportunidade",
};

export default async function AdminLeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const { q, temperatura } = await searchParams;
  const query = typeof q === "string" ? q.toLowerCase() : "";
  const tempFilter = typeof temperatura === "string" ? temperatura : "";

  const store = getStore();
  let leads = store.listLeads();

  if (query) {
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        (l.company ?? "").toLowerCase().includes(query),
    );
  }
  if (tempFilter) {
    leads = leads.filter((l) => l.temperature === tempFilter);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Painel administrativo</p>
          <h1 className="mt-2 text-[length:var(--text-title)]">Leads</h1>
        </div>
        <ExportCsvButton query={query} temperatura={tempFilter} />
      </div>
      <GoldDivider />

      <form className="flex flex-wrap gap-4" method="get">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por nome, e-mail ou empresa"
          className="min-h-[44px] flex-1 min-w-[220px] border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none"
        />
        <select
          name="temperatura"
          defaultValue={tempFilter}
          className="min-h-[44px] border border-line bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">Todas as temperaturas</option>
          {Object.entries(TEMPERATURE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="min-h-[44px] border border-line px-6 text-xs uppercase tracking-[0.15em] text-ink hover:border-accent"
        >
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="py-3 pr-4">Nome</th>
              <th className="py-3 pr-4">Contato</th>
              <th className="py-3 pr-4">Segmento</th>
              <th className="py-3 pr-4">Temperatura</th>
              <th className="py-3 pr-4">Origem</th>
              <th className="py-3 pr-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-line/50">
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-ink hover:text-accent hover:underline"
                  >
                    {lead.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-ink-muted">{lead.email}</td>
                <td className="py-3 pr-4 text-ink-muted">{lead.segment}</td>
                <td className="py-3 pr-4">
                  <span className="text-accent">{TEMPERATURE_LABELS[lead.temperature]}</span>
                </td>
                <td className="py-3 pr-4 text-ink-muted">{lead.utm.utm_source ?? "—"}</td>
                <td className="py-3 pr-4 text-ink-muted">
                  {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ink-muted">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
