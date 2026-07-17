import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  AssessmentRecord,
  LeadRecord,
  PaymentRecord,
  AnalyticsEventRecord,
} from "@/lib/db/types";
import type { QuestionnaireInput } from "@/lib/schemas/questionnaire";

const state: {
  leads: LeadRecord[];
  assessments: AssessmentRecord[];
  payments: PaymentRecord[];
  events: AnalyticsEventRecord[];
} = { leads: [], assessments: [], payments: [], events: [] };

vi.mock("@/lib/db", () => ({
  getStore: () => ({
    getLead: (id: string) => state.leads.find((l) => l.id === id),
    updateLead: (id: string, patch: Partial<LeadRecord>) => {
      const lead = state.leads.find((l) => l.id === id);
      if (lead) Object.assign(lead, patch);
      return lead;
    },
    listAssessments: () => state.assessments,
    getPaymentsByAssessment: (assessmentId: string) =>
      state.payments.filter((p) => p.assessmentId === assessmentId),
    listEvents: () => state.events,
  }),
}));

const baseAnswers: QuestionnaireInput = {
  segment: "Advocacia",
  role: "Sócia-fundadora",
  photoUsage: ["linkedin"],
  targetAudience: "Empresários",
  desiredPerception: ["premium", "autoridade"],
  desiredTraits: ["autoridade", "confiança", "liderança"],
  avoidPerceptions: ["amadorismo"],
  desiredArchetypes: ["sabio"],
  currentRepresentation: 1,
  mainDiscomfort:
    "Minha foto atual é de uma festa de família e não representa minha atuação profissional hoje",
};

function makeLead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: "lead-1",
    name: "Ana",
    email: "ana@x.com",
    whatsapp: "62999999999",
    segment: "Advocacia",
    role: "Sócia-fundadora",
    consentContact: true,
    consentMarketing: false,
    score: 0,
    temperature: "frio",
    createdAt: "",
    updatedAt: "",
    utm: {},
    ...overrides,
  };
}

function makeAssessment(overrides: Partial<AssessmentRecord> = {}): AssessmentRecord {
  return {
    id: "assess-1",
    leadId: "lead-1",
    publicToken: "x".repeat(43),
    status: "photo_pending",
    desiredArchetypes: ["sabio"],
    answers: baseAnswers,
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}

describe("recalculateLeadScore", () => {
  beforeEach(() => {
    state.leads = [makeLead()];
    state.assessments = [makeAssessment()];
    state.payments = [];
    state.events = [];
  });

  it("pontua sinais do questionário: premium + liderança + baixa representação + incômodo alto", async () => {
    const { recalculateLeadScore } = await import("./leadscoring-service");
    recalculateLeadScore("lead-1");
    // premiumPerception 15 + leadershipRole 12 + ownBusiness 12 + highDiscomfort 10
    // + lowRepresentation 10 + prioritySegment 8 = 67 -> qualificado
    expect(state.leads[0].score).toBe(67);
    expect(state.leads[0].temperature).toBe("qualificado");
  });

  it("compra do relatório completo eleva para oportunidade", async () => {
    state.payments = [
      {
        id: "pay-1",
        assessmentId: "assess-1",
        provider: "simulado",
        amountCents: 9700,
        currency: "BRL",
        status: "approved",
        createdAt: "",
        updatedAt: "",
      },
    ];
    const { recalculateLeadScore } = await import("./leadscoring-service");
    recalculateLeadScore("lead-1");
    expect(state.leads[0].score).toBe(67 + 25);
    expect(state.leads[0].temperature).toBe("oportunidade");
  });

  it("clique em agendamento soma pontos", async () => {
    state.events = [
      {
        id: "ev-1",
        leadId: "lead-1",
        eventName: "booking_clicked",
        payload: {},
        createdAt: "",
      },
    ];
    const { recalculateLeadScore } = await import("./leadscoring-service");
    recalculateLeadScore("lead-1");
    expect(state.leads[0].score).toBe(67 + 20);
  });

  it("lead sem sinais fica frio", async () => {
    state.leads = [
      makeLead({ role: "Analista", segment: "Varejo", instagram: undefined }),
    ];
    state.assessments = [
      makeAssessment({
        answers: {
          ...baseAnswers,
          desiredPerception: ["acessivel"],
          currentRepresentation: 4,
          mainDiscomfort: "nada",
        },
      }),
    ];
    const { recalculateLeadScore } = await import("./leadscoring-service");
    recalculateLeadScore("lead-1");
    expect(state.leads[0].temperature).toBe("frio");
  });

  it("lead inexistente não quebra", async () => {
    const { recalculateLeadScore } = await import("./leadscoring-service");
    expect(() => recalculateLeadScore("nao-existe")).not.toThrow();
  });
});
