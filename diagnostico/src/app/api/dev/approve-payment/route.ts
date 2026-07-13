import { NextResponse, type NextRequest } from "next/server";
import { isDemoMode } from "@/lib/config";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { approvePayment, rejectPayment } from "@/lib/payments";

/**
 * Rota RESTRITA de simulação de pagamento.
 * Existe apenas em DEMO_MODE — em produção responde 404.
 */
export async function POST(request: NextRequest) {
  if (!isDemoMode) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  let body: { token?: string; outcome?: "approved" | "rejected" };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const token = body.token ?? "";
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const store = getStore();
  const assessment = store.getAssessmentByToken(token);
  if (!assessment) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

  const payment = store
    .getPaymentsByAssessment(assessment.id)
    .find((p) => p.status === "pending");
  if (!payment) {
    return NextResponse.json({ error: "Nenhum pagamento pendente." }, { status: 409 });
  }

  if (body.outcome === "rejected") {
    rejectPayment(payment.id);
    return NextResponse.json({ status: "rejected" });
  }

  approvePayment(payment.id, { externalId: `demo-${payment.id}` });
  return NextResponse.json({ status: "approved" });
}
