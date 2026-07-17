export function AdminMetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-line bg-surface p-6">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
    </div>
  );
}
