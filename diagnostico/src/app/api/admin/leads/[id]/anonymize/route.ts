import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/admin/leads/[id]/anonymize">,
) {
  const { id } = await ctx.params;
  const store = getStore();
  const lead = store.anonymizeLead(id);
  if (!lead) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

  store.recordAudit({
    action: "lead_anonymized",
    entityType: "lead",
    entityId: id,
    detail: {},
  });

  return NextResponse.json({ ok: true });
}
