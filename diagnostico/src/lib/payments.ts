import "server-only";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { config, isDemoMode } from "@/lib/config";
import { getStore } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import type { AssessmentRecord, PaymentRecord } from "@/lib/db/types";

/**
 * Máquina de estados do pagamento — única para simulado e Mercado Pago.
 * Liberação do relatório acontece SOMENTE aqui, via approvePayment
 * (chamada pelo webhook verificado ou pela rota de simulação em demo).
 */

export type CheckoutResult = {
  paymentId: string;
  /** URL para onde enviar o usuário (Checkout Pro ou checkout simulado). */
  checkoutUrl: string;
  simulated: boolean;
};

function getPrice(): number {
  // Preço central: app_settings quando houver banco; fallback env.
  return config.FULL_REPORT_PRICE_CENTS;
}

export async function createCheckout(assessment: AssessmentRecord): Promise<CheckoutResult> {
  const store = getStore();

  // Reutiliza pagamento pendente existente (evita duplicatas)
  const existing = store
    .getPaymentsByAssessment(assessment.id)
    .find((p) => p.status === "pending");

  trackEvent("checkout_started", { assessmentId: assessment.id, leadId: assessment.leadId });

  if (isDemoMode || !config.MERCADO_PAGO_ACCESS_TOKEN) {
    const payment =
      existing ??
      store.createPayment({
        assessmentId: assessment.id,
        provider: "simulado",
        amountCents: getPrice(),
        currency: "BRL",
        status: "pending",
      });
    trackEvent("payment_pending", { assessmentId: assessment.id });
    return {
      paymentId: payment.id,
      checkoutUrl: `/diagnostico/pagamento/simulado?token=${assessment.publicToken}`,
      simulated: true,
    };
  }

  // ── Mercado Pago Checkout Pro (produção) ─────────────────────────
  const mp = new MercadoPagoConfig({ accessToken: config.MERCADO_PAGO_ACCESS_TOKEN });
  const preference = await new Preference(mp).create({
    body: {
      items: [
        {
          id: "diagnostico-completo",
          title: "Diagnóstico de Expressão — Relatório Completo",
          quantity: 1,
          unit_price: getPrice() / 100,
          currency_id: "BRL",
        },
      ],
      external_reference: assessment.id,
      back_urls: {
        success: `${config.NEXT_PUBLIC_APP_URL}/diagnostico/pagamento/sucesso?token=${assessment.publicToken}`,
        pending: `${config.NEXT_PUBLIC_APP_URL}/diagnostico/pagamento/pendente?token=${assessment.publicToken}`,
        failure: `${config.NEXT_PUBLIC_APP_URL}/diagnostico/pagamento/falha?token=${assessment.publicToken}`,
      },
      auto_return: "approved",
      notification_url: `${config.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  const payment =
    existing ??
    store.createPayment({
      assessmentId: assessment.id,
      provider: "mercadopago",
      externalId: preference.id ?? undefined,
      amountCents: getPrice(),
      currency: "BRL",
      status: "pending",
    });
  trackEvent("payment_pending", { assessmentId: assessment.id });

  return {
    paymentId: payment.id,
    checkoutUrl: preference.init_point ?? "",
    simulated: false,
  };
}

/**
 * Aprova um pagamento e libera o relatório. Idempotente:
 * pagamento já aprovado ou assessment já pago → no-op.
 */
export function approvePayment(
  paymentId: string,
  opts: { externalId?: string; amountCents?: number } = {},
): PaymentRecord | undefined {
  const store = getStore();
  const payments = store.listPayments();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return undefined;

  if (payment.status === "approved") return payment; // idempotência

  const updated = store.updatePayment(payment.id, {
    status: "approved",
    approvedAt: new Date().toISOString(),
    externalId: opts.externalId ?? payment.externalId,
    amountCents: opts.amountCents ?? payment.amountCents,
  });

  const assessment = store.getAssessment(payment.assessmentId);
  if (assessment && assessment.status !== "paid") {
    store.updateAssessment(assessment.id, {
      status: "paid",
      releasedAt: new Date().toISOString(),
    });
    trackEvent("payment_approved", {
      assessmentId: assessment.id,
      leadId: assessment.leadId,
      payload: { amountCents: updated?.amountCents },
    });
  }
  return updated;
}

export function rejectPayment(paymentId: string): PaymentRecord | undefined {
  const store = getStore();
  const payment = store.listPayments().find((p) => p.id === paymentId);
  if (!payment || payment.status === "approved") return payment;
  const updated = store.updatePayment(payment.id, { status: "rejected" });
  const assessment = store.getAssessment(payment.assessmentId);
  trackEvent("payment_failed", { assessmentId: assessment?.id, leadId: assessment?.leadId });
  return updated;
}

/**
 * Processa notificação do Mercado Pago: busca o pagamento NA API DO MP
 * (nunca confia no payload do webhook) e aplica idempotência por external_id.
 */
export async function processMercadoPagoNotification(mpPaymentId: string): Promise<void> {
  if (!config.MERCADO_PAGO_ACCESS_TOKEN) return;

  const store = getStore();

  // Idempotência: notificação repetida para pagamento já aprovado
  const already = store.getPaymentByExternalId("mercadopago", mpPaymentId);
  if (already?.status === "approved") return;

  const mp = new MercadoPagoConfig({ accessToken: config.MERCADO_PAGO_ACCESS_TOKEN });
  const mpPayment = await new Payment(mp).get({ id: mpPaymentId });

  const assessmentId = mpPayment.external_reference;
  if (!assessmentId) return;
  const assessment = getStore().getAssessment(assessmentId);
  if (!assessment) return;

  const local =
    already ??
    store.getPaymentsByAssessment(assessment.id).find((p) => p.status === "pending") ??
    store.createPayment({
      assessmentId: assessment.id,
      provider: "mercadopago",
      externalId: mpPaymentId,
      amountCents: Math.round((mpPayment.transaction_amount ?? 0) * 100),
      currency: mpPayment.currency_id ?? "BRL",
      status: "pending",
    });

  if (mpPayment.status === "approved") {
    approvePayment(local.id, {
      externalId: mpPaymentId,
      amountCents: Math.round((mpPayment.transaction_amount ?? 0) * 100),
    });
  } else if (mpPayment.status === "rejected" || mpPayment.status === "cancelled") {
    rejectPayment(local.id);
  }
  // pending/in_process: mantém como está
}
