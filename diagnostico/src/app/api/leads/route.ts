import { NextResponse, type NextRequest } from "next/server";
import { leadSchema, utmSchema } from "@/lib/schemas/lead";
import { getStore } from "@/lib/db";
import { generatePublicToken } from "@/lib/tokens";
import { rateLimit, clientKey } from "@/lib/ratelimit";
import { trackEvent } from "@/lib/events";

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(clientKey(request, "leads"), {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um instante." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const utm = utmSchema.parse((body as Record<string, unknown>)?.utm ?? {});

  const store = getStore();
  const lead = store.createLead({
    name: parsed.data.name,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
    company: parsed.data.company,
    role: parsed.data.role,
    segment: parsed.data.segment,
    instagram: parsed.data.instagram || undefined,
    linkedin: parsed.data.linkedin || undefined,
    city: parsed.data.city || undefined,
    contactOrigin: parsed.data.contactOrigin || undefined,
    utm,
    consentContact: parsed.data.consentContact,
    consentMarketing: parsed.data.consentMarketing,
    score: 0,
    temperature: "frio",
  });

  const assessment = store.createAssessment({
    leadId: lead.id,
    publicToken: generatePublicToken(),
    status: "answering",
    desiredArchetypes: [],
  });

  trackEvent("lead_submitted", { leadId: lead.id, assessmentId: assessment.id });

  return NextResponse.json({ token: assessment.publicToken }, { status: 201 });
}
