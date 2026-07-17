import { NextResponse, type NextRequest } from "next/server";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { createCheckout } from "@/lib/payments";
import { getEffectiveSettings } from "@/lib/settings";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/assessments/[token]/checkout">,
) {
  const { allowed } = rateLimit(clientKey(request, "checkout"), {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });

  const { token } = await ctx.params;
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const assessment = getStore().getAssessmentByToken(token);
  if (!assessment) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  if (assessment.status === "paid") {
    return NextResponse.json({ alreadyPaid: true });
  }
  if (assessment.status !== "free_ready") {
    return NextResponse.json({ error: "Diagnóstico ainda não concluído." }, { status: 409 });
  }
  if (!getEffectiveSettings().checkoutEnabled) {
    return NextResponse.json({ error: "Checkout temporariamente indisponível." }, { status: 503 });
  }

  try {
    const checkout = await createCheckout(assessment);
    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      simulated: checkout.simulated,
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 500 },
    );
  }
}
