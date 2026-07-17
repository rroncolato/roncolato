import "server-only";
import { getStore } from "@/lib/db";
import { calculateLeadScore, classifyLead, isLeadershipRole, type LeadSignals } from "@/lib/leadscore";

/**
 * Segmentos prioritários para o negócio — ajustável sem tocar na fórmula.
 * Comparação por substring, case-insensitive.
 */
const PRIORITY_SEGMENTS = [
  "advocacia", "direito", "medicina", "saúde", "saude", "consultoria",
  "finanças", "financas", "investimentos", "imobiliário", "imobiliario",
];

const OWNER_KEYWORDS = [
  "fundador", "fundadora", "founder", "sócio", "socio", "sócia",
  "proprietário", "proprietária", "dono", "dona",
];

/** Heurística simples: relato de incômodo mais longo/detalhado tende a indicar maior dor. */
const HIGH_DISCOMFORT_MIN_LENGTH = 40;

function includesAny(value: string, keywords: string[]): boolean {
  const v = value.toLowerCase();
  return keywords.some((k) => v.includes(k));
}

/**
 * Recalcula score/temperatura do lead a partir do estado atual
 * (respostas do questionário, pagamentos, eventos do funil).
 * Chamado nos pontos de mudança de sinal — nunca no carregamento de página.
 */
export function recalculateLeadScore(leadId: string): void {
  const store = getStore();
  const lead = store.getLead(leadId);
  if (!lead) return;

  const assessments = store.listAssessments().filter((a) => a.leadId === leadId);
  const latestWithAnswers = assessments.find((a) => a.answers);
  const answers = latestWithAnswers?.answers;

  const payments = assessments.flatMap((a) => store.getPaymentsByAssessment(a.id));
  const events = store.listEvents().filter((e) => e.leadId === leadId);

  const signals: Partial<LeadSignals> = {
    premiumPerception: answers?.desiredPerception.some((p) =>
      ["premium", "autoridade", "referencia"].includes(p),
    ),
    leadershipRole: isLeadershipRole(lead.role ?? ""),
    ownBusiness: includesAny(lead.role ?? "", OWNER_KEYWORDS),
    highDiscomfort: (answers?.mainDiscomfort?.length ?? 0) >= HIGH_DISCOMFORT_MIN_LENGTH,
    lowRepresentation: (answers?.currentRepresentation ?? 5) <= 2,
    purchasedFullReport: payments.some((p) => p.status === "approved"),
    repeatedReportAccess: events.filter((e) => e.eventName === "full_report_viewed").length > 1,
    bookingClicked: events.some((e) => e.eventName === "booking_clicked"),
    whatsappClicked: events.some((e) => e.eventName === "whatsapp_clicked"),
    prioritySegment: includesAny(lead.segment ?? "", PRIORITY_SEGMENTS),
    completeProfile: Boolean(lead.instagram || lead.linkedin || lead.city),
  };

  const score = calculateLeadScore(signals);
  const temperature = classifyLead(score);

  if (score !== lead.score || temperature !== lead.temperature) {
    store.updateLead(leadId, { score, temperature });
  }
}
