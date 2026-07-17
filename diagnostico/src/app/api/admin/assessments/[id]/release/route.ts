import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/admin/assessments/[id]/release">,
) {
  const { id } = await ctx.params;
  const store = getStore();
  const assessment = store.getAssessment(id);
  if (!assessment) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  if (!assessment.result) {
    return NextResponse.json({ error: "Diagnóstico ainda não foi processado." }, { status: 409 });
  }

  store.updateAssessment(id, { status: "paid", releasedAt: new Date().toISOString() });
  store.recordAudit({
    action: "status_changed",
    entityType: "assessment",
    entityId: id,
    detail: { to: "paid", reason: "liberação manual pelo admin" },
  });

  return NextResponse.json({ ok: true });
}
