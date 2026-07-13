import { NextResponse, type NextRequest } from "next/server";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";

/** Status público do assessment — nunca expõe resultado completo aqui. */
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/assessments/[token]">,
) {
  const { token } = await ctx.params;
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const assessment = getStore().getAssessmentByToken(token);
  if (!assessment || assessment.status === "deleted") {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    status: assessment.status,
    failureReason: assessment.failureReason,
  });
}
