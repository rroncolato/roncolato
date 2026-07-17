export function ExportCsvButton({ query, temperatura }: { query: string; temperatura: string }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (temperatura) params.set("temperatura", temperatura);

  return (
    <a
      href={`/api/admin/leads/export?${params.toString()}`}
      className="inline-flex min-h-[44px] items-center justify-center border border-line px-6 text-xs uppercase tracking-[0.15em] text-ink hover:border-accent"
    >
      Exportar CSV
    </a>
  );
}
