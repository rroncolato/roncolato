import { NextResponse, type NextRequest } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";
import { getStore } from "@/lib/db";
import { DEMO_UPLOADS_DIR } from "@/lib/db/demo-store";
import { isValidTokenFormat } from "@/lib/tokens";
import { processUpload, ImageProcessingError } from "@/lib/images";
import { rateLimit, clientKey } from "@/lib/ratelimit";
import { trackEvent } from "@/lib/events";
import { config } from "@/lib/config";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_type: "Formato não aceito. Envie uma imagem JPG, PNG ou WebP.",
  too_large: `A imagem excede o limite de ${config.MAX_IMAGE_SIZE_MB} MB.`,
  too_small: "A imagem é muito pequena. Envie uma foto com pelo menos 400 × 400 pixels.",
  corrupted: "Não foi possível ler esta imagem. Tente outro arquivo.",
};

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/assessments/[token]/photo">,
) {
  const { allowed } = rateLimit(clientKey(request, "photo"), {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  const { token } = await ctx.params;
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const store = getStore();
  const assessment = store.getAssessmentByToken(token);
  if (!assessment) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }
  if (!["photo_pending", "failed"].includes(assessment.status)) {
    return NextResponse.json({ error: "Etapa inválida." }, { status: 409 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");
  const consentAnalysis = formData.get("consentAnalysis") === "true";
  const consentPortfolio = formData.get("consentPortfolio") === "true";

  if (!consentAnalysis) {
    return NextResponse.json(
      { error: "É necessário autorizar a análise da imagem." },
      { status: 422 },
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhuma imagem enviada." }, { status: 422 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  try {
    const processed = await processUpload(input);

    // Deduplicação por hash: mesma imagem no mesmo assessment = no-op
    const existing = store.getImageByAssessment(assessment.id);
    if (existing?.hashSha256 === processed.hashSha256) {
      return NextResponse.json({ ok: true, deduplicated: true });
    }

    // DEMO_MODE: filesystem local (produção usará bucket privado Supabase)
    const storagePath = join(DEMO_UPLOADS_DIR, `${assessment.id}.jpg`);
    writeFileSync(storagePath, processed.buffer);

    const retentionUntil = new Date(
      Date.now() + config.IMAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    store.createImage({
      assessmentId: assessment.id,
      storagePath,
      mimeType: processed.mimeType,
      width: processed.width,
      height: processed.height,
      sizeBytes: processed.sizeBytes,
      hashSha256: processed.hashSha256,
      consentAnalysis,
      consentPortfolio,
      retentionUntil,
    });

    trackEvent("photo_uploaded", { assessmentId: assessment.id, leadId: assessment.leadId });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ImageProcessingError) {
      return NextResponse.json({ error: ERROR_MESSAGES[err.code] }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Não foi possível processar a imagem. Tente novamente." },
      { status: 500 },
    );
  }
}
