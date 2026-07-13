import { scoreBand } from "@/lib/scoring";

/** Nota geral em círculo editorial. Inclui alternativa textual. */
export function ScoreGauge({ score }: { score: number }) {
  const band = scoreBand(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <figure className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36" aria-hidden>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl text-ink">{score}</span>
        </div>
      </div>
      <figcaption className="text-center">
        <span className="font-display text-sm uppercase tracking-[0.15em] text-accent">
          {band.label}
        </span>
        <span className="sr-only">Pontuação geral: {score} de 100.</span>
      </figcaption>
    </figure>
  );
}
