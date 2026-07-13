/**
 * Cálculo da nota geral do diagnóstico.
 * ÚNICA fonte da fórmula — a IA retorna pilares 0–100,
 * o backend calcula a nota geral aqui. Nunca aceitar do modelo.
 */

export const PILLAR_WEIGHTS = {
  expression: 0.2,
  authority: 0.2,
  connection: 0.15,
  visualCoherence: 0.15,
  archetypalAlignment: 0.2,
  perceivedValue: 0.1,
} as const;

export type PillarScores = Record<keyof typeof PILLAR_WEIGHTS, number>;

export type ScoreBand = {
  min: number;
  max: number;
  label: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  { min: 0, max: 39, label: "Imagem desalinhada" },
  { min: 40, max: 59, label: "Imagem parcialmente coerente" },
  { min: 60, max: 74, label: "Boa base de posicionamento" },
  { min: 75, max: 89, label: "Imagem forte e consistente" },
  { min: 90, max: 100, label: "Imagem altamente alinhada" },
];

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** Nota geral ponderada, arredondada para inteiro 0–100. */
export function calculateOverallScore(scores: PillarScores): number {
  const total = (Object.keys(PILLAR_WEIGHTS) as Array<keyof PillarScores>).reduce(
    (sum, pillar) => sum + clamp(scores[pillar]) * PILLAR_WEIGHTS[pillar],
    0,
  );
  return Math.round(clamp(total));
}

export function scoreBand(score: number): ScoreBand {
  const s = clamp(score);
  return SCORE_BANDS.find((b) => s >= b.min && s <= b.max) ?? SCORE_BANDS[0];
}
