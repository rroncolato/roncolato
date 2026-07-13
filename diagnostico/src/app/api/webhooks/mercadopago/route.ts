import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "crypto";
import { config } from "@/lib/config";
import { processMercadoPagoNotification } from "@/lib/payments";

/**
 * Webhook do Mercado Pago.
 * Segurança: valida assinatura (x-signature) quando o secret está configurado,
 * e SEMPRE verifica o pagamento direto na API do MP — o payload nunca é
 * fonte de verdade. Idempotente por external_id.
 */

function validateSignature(request: NextRequest, dataId: string): boolean {
  const secret = config.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return true; // sem secret configurado, segue só com a verificação na API

  const signature = request.headers.get("x-signature") ?? "";
  const requestId = request.headers.get("x-request-id") ?? "";

  const parts = Object.fromEntries(
    signature.split(",").map((p) => p.trim().split("=") as [string, string]),
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected === v1;
}

export async function POST(request: NextRequest) {
  let body: { type?: string; data?: { id?: string } };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Só nos interessam notificações de pagamento
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true }); // ack para não gerar retries do MP
  }

  const dataId = String(body.data.id);
  if (!validateSignature(request, dataId)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    await processMercadoPagoNotification(dataId);
  } catch {
    // 500 → MP reenvia depois (retry natural do provedor)
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
