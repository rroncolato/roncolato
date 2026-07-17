import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/admin/assessments/[id]/delete-photo">,
) {
  const { id } = await ctx.params;
  const store = getStore();
  store.deleteImage(id);
  store.recordAudit({ action: "photo_deleted", entityType: "assessment", entityId: id, detail: {} });
  return NextResponse.json({ ok: true });
}
