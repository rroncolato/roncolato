import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AssessmentRecord, PaymentRecord } from "@/lib/db/types";

vi.mock("@/lib/leadscoring-service", () => ({
  recalculateLeadScore: vi.fn(),
}));

vi.mock("@/lib/config", () => ({
  config: {
    FULL_REPORT_PRICE_CENTS: 9700,
    MERCADO_PAGO_ACCESS_TOKEN: "",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  },
  isDemoMode: true,
}));

// Store fake em memória com a mesma interface usada por payments.ts
const state: { payments: PaymentRecord[]; assessments: AssessmentRecord[] } = {
  payments: [],
  assessments: [],
};

vi.mock("@/lib/db", () => ({
  getStore: () => ({
    listPayments: () => state.payments,
    getPaymentsByAssessment: (id: string) =>
      state.payments.filter((p) => p.assessmentId === id),
    getPaymentByExternalId: (provider: string, externalId: string) =>
      state.payments.find((p) => p.provider === provider && p.externalId === externalId),
    createPayment: (input: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">) => {
      const payment: PaymentRecord = {
        ...input,
        id: `pay-${state.payments.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.payments.push(payment);
      return payment;
    },
    updatePayment: (id: string, patch: Partial<PaymentRecord>) => {
      const p = state.payments.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
      return p;
    },
    getAssessment: (id: string) => state.assessments.find((a) => a.id === id),
    updateAssessment: (id: string, patch: Partial<AssessmentRecord>) => {
      const a = state.assessments.find((x) => x.id === id);
      if (a) Object.assign(a, patch);
      return a;
    },
    recordEvent: () => undefined,
  }),
}));

const assessment: AssessmentRecord = {
  id: "assess-1",
  leadId: "lead-1",
  publicToken: "x".repeat(43),
  status: "free_ready",
  desiredArchetypes: [],
  createdAt: "",
  updatedAt: "",
};

describe("payments (modo simulado)", () => {
  beforeEach(() => {
    state.payments = [];
    state.assessments = [{ ...assessment, status: "free_ready" }];
  });

  it("createCheckout cria pagamento pendente simulado", async () => {
    const { createCheckout } = await import("./payments");
    const result = await createCheckout(state.assessments[0]);
    expect(result.simulated).toBe(true);
    expect(result.checkoutUrl).toContain("/diagnostico/pagamento/simulado");
    expect(state.payments).toHaveLength(1);
    expect(state.payments[0].status).toBe("pending");
    expect(state.payments[0].amountCents).toBe(9700);
  });

  it("checkout repetido reutiliza pagamento pendente (sem duplicar)", async () => {
    const { createCheckout } = await import("./payments");
    await createCheckout(state.assessments[0]);
    await createCheckout(state.assessments[0]);
    expect(state.payments).toHaveLength(1);
  });

  it("approvePayment libera o relatório", async () => {
    const { createCheckout, approvePayment } = await import("./payments");
    const { paymentId } = await createCheckout(state.assessments[0]);
    approvePayment(paymentId, { externalId: "ext-1" });
    expect(state.payments[0].status).toBe("approved");
    expect(state.payments[0].approvedAt).toBeTruthy();
    expect(state.assessments[0].status).toBe("paid");
    expect(state.assessments[0].releasedAt).toBeTruthy();
  });

  it("approvePayment é idempotente (webhook repetido)", async () => {
    const { createCheckout, approvePayment } = await import("./payments");
    const { paymentId } = await createCheckout(state.assessments[0]);
    approvePayment(paymentId);
    const firstApprovedAt = state.payments[0].approvedAt;
    approvePayment(paymentId);
    approvePayment(paymentId);
    expect(state.payments[0].approvedAt).toBe(firstApprovedAt);
    expect(state.payments.filter((p) => p.status === "approved")).toHaveLength(1);
  });

  it("rejectPayment não derruba pagamento já aprovado", async () => {
    const { createCheckout, approvePayment, rejectPayment } = await import("./payments");
    const { paymentId } = await createCheckout(state.assessments[0]);
    approvePayment(paymentId);
    rejectPayment(paymentId);
    expect(state.payments[0].status).toBe("approved");
    expect(state.assessments[0].status).toBe("paid");
  });
});
