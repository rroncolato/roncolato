/** Nota de um pilar com barra fina editorial + valor. Inclui texto acessível. */
export function PillarScore({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm tracking-wide text-ink-muted">{label}</span>
        <span className="font-display text-lg text-ink">{score}</span>
      </div>
      <div
        role="img"
        aria-label={`${label}: ${score} de 100`}
        className="mt-2 h-px w-full bg-line"
      >
        <div className="h-px bg-accent" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
