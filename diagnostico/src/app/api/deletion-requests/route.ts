import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(clientKey(request, "deletion"), {
    limit: 5,
    windowMs: 60_000,
  });
  if (!allowed) return NextResponse.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });

  // Registra o pedido vinculado ao lead, se existir — sem revelar existência.
  const store = getStore();
  const lead = store.listLeads().find((l) => l.email === parsed.data.email.toLowerCase());
  trackEvent("deletion_requested", {
    leadId: lead?.id,
    payload: lead ? {} : { unmatched: true },
  });

  return NextResponse.json({ ok: true });
}
