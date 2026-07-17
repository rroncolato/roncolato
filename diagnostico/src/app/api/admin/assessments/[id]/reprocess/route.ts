import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { runAnalysis } from "@/lib/analysis";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/admin/assessments/[id]/reprocess">,
) {
  const { id } = await ctx.params;
  const store = getStore();
  const assessment = store.getAssessment(id);
  if (!assessment) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

  store.updateAssessment(id, { status: "photo_pending", failureReason: undefined });
  store.recordAudit({
    action: "reprocessed",
    entityType: "assessment",
    entityId: id,
    detail: {},
  });

  try {
    await runAnalysis(id);
  } catch {
    return NextResponse.json({ error: "Falha ao reprocessar." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: store.getAssessment(id)?.status });
}
