/**
 * Lead scoring interno — nunca exibido ao usuário.
 * Fórmula centralizada e facilmente ajustável: pesos em SIGNAL_POINTS.
 */

export type LeadTemperature = "frio" | "morno" | "qualificado" | "oportunidade";

export type LeadSignals = {
  premiumPerception: boolean; // deseja premium/autoridade/referência
  leadershipRole: boolean; // cargo de liderança
  ownBusiness: boolean; // empresa própria
  highDiscomfort: boolean; // incômodo alto com a foto atual
  lowRepresentation: boolean; // P9 <= 2
  purchasedFullReport: boolean;
  repeatedReportAccess: boolean;
  bookingClicked: boolean;
  whatsappClicked: boolean;
  prioritySegment: boolean;
  completeProfile: boolean; // preencheu opcionais
};

export const SIGNAL_POINTS: Record<keyof LeadSignals, number> = {
  premiumPerception: 15,
  leadershipRole: 12,
  ownBusiness: 12,
  highDiscomfort: 10,
  lowRepresentation: 10,
  purchasedFullReport: 25,
  repeatedReportAccess: 8,
  bookingClicked: 20,
  whatsappClicked: 15,
  prioritySegment: 8,
  completeProfile: 5,
};

const LEADERSHIP_KEYWORDS = [
  "ceo", "cfo", "cto", "coo", "diretor", "diretora", "sócio", "socio", "sócia",
  "fundador", "fundadora", "founder", "presidente", "proprietário", "proprietária",
  "dono", "dona", "head", "gerente", "gestor", "gestora",
];

export function isLeadershipRole(role: string): boolean {
  const r = role.toLowerCase();
  return LEADERSHIP_KEYWORDS.some((k) => r.includes(k));
}

export function calculateLeadScore(signals: Partial<LeadSignals>): number {
  return (Object.keys(SIGNAL_POINTS) as Array<keyof LeadSignals>).reduce(
    (sum, key) => sum + (signals[key] ? SIGNAL_POINTS[key] : 0),
    0,
  );
}

export function classifyLead(score: number): LeadTemperature {
  if (score >= 70) return "oportunidade";
  if (score >= 45) return "qualificado";
  if (score >= 20) return "morno";
  return "frio";
}
