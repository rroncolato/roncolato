import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/admin/assessments/[id]/delete">,
) {
  const { id } = await ctx.params;
  const store = getStore();
  store.deleteAssessment(id);
  store.recordAudit({
    action: "assessment_deleted",
    entityType: "assessment",
    entityId: id,
    detail: {},
  });
  return NextResponse.json({ ok: true });
}
