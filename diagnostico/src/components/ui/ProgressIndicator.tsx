export function ProgressIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-xs tracking-[0.15em] uppercase text-ink-muted">
        <span>{label ?? "Progresso"}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label ?? "Progresso do questionário"}
        className="h-px w-full bg-line"
      >
        <div
          className="h-px bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
