import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/db";
import { FUNNEL_EVENTS, trackEvent, type FunnelEvent } from "@/lib/events";
import { isValidTokenFormat } from "@/lib/tokens";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const eventSchema = z.object({
  event: z.enum(FUNNEL_EVENTS as unknown as [FunnelEvent, ...FunnelEvent[]]),
  token: z.string().optional(),
  sessionId: z.string().max(64).optional(),
  source: z.string().max(120).optional(),
});

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(clientKey(request, "events"), {
    limit: 60,
    windowMs: 60_000,
  });
  if (!allowed) return NextResponse.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });

  let assessmentId: string | undefined;
  let leadId: string | undefined;
  if (parsed.data.token && isValidTokenFormat(parsed.data.token)) {
    const assessment = getStore().getAssessmentByToken(parsed.data.token);
    assessmentId = assessment?.id;
    leadId = assessment?.leadId;
  }

  trackEvent(parsed.data.event, {
    assessmentId,
    leadId,
    sessionId: parsed.data.sessionId,
    source: parsed.data.source,
  });

  return NextResponse.json({ ok: true });
}
