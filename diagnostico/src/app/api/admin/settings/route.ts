import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/db";

const schema = z.object({
  fullReportPriceCents: z.coerce.number().int().positive(),
  bookingUrl: z.string(),
  whatsappNumber: z.string(),
  imageRetentionDays: z.coerce.number().int().positive(),
  checkoutEnabled: z.boolean(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 422 });
  }

  const store = getStore();
  store.updateSettings(parsed.data);
  store.recordAudit({
    action: "settings_updated",
    entityType: "settings",
    detail: { fields: Object.keys(parsed.data) },
  });

  return NextResponse.json({ ok: true });
}
