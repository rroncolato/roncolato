import { NextResponse, type NextRequest } from "next/server";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { runAnalysis } from "@/lib/analysis";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/assessments/[token]/analyze">,
) {
  const { allowed } = rateLimit(clientKey(request, "analyze"), {
    limit: 10,
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

  try {
    await runAnalysis(assessment.id);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível iniciar a análise." },
      { status: 500 },
    );
  }

  const updated = store.getAssessment(assessment.id);
  return NextResponse.json({ status: updated?.status, failureReason: updated?.failureReason });
}
