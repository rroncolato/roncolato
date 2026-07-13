import { NextResponse, type NextRequest } from "next/server";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { rateLimit, clientKey } from "@/lib/ratelimit";
import { trackEvent } from "@/lib/events";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/assessments/[token]/answers">,
) {
  const { allowed } = rateLimit(clientKey(request, "answers"), {
    limit: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  const { token } = await ctx.params;
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const store = getStore();
  const assessment = store.getAssessmentByToken(token);
  if (!assessment) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }
  if (!["answering", "photo_pending"].includes(assessment.status)) {
    return NextResponse.json({ error: "Etapa já concluída." }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = questionnaireSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Respostas inválidas.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  store.updateAssessment(assessment.id, {
    answers: parsed.data,
    desiredArchetypes: parsed.data.desiredArchetypes,
    status: "photo_pending",
  });

  trackEvent("questionnaire_completed", {
    assessmentId: assessment.id,
    leadId: assessment.leadId,
  });

  return NextResponse.json({ ok: true });
}
