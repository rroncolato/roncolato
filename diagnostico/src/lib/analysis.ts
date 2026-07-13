import "server-only";
import { readFileSync } from "fs";
import { config, isDemoMode } from "@/lib/config";
import { getStore } from "@/lib/db";
import { DemoDiagnosticProvider } from "@/lib/ai/demo";
import type { DiagnosticInput, VisionDiagnosticProvider } from "@/lib/ai/provider";
import { DiagnosticResultSchema } from "@/lib/schemas/diagnostic-result";
import { calculateOverallScore } from "@/lib/scoring";
import { PROMPT_VERSION } from "@/lib/ai/prompts/version";
import { trackEvent } from "@/lib/events";

function getProvider(): VisionDiagnosticProvider {
  if (isDemoMode || config.AI_PROVIDER === "demo") return new DemoDiagnosticProvider();
  // Adapter Anthropic entra na Fase 3.
  throw new Error("Provider real ainda não configurado — use AI_PROVIDER=demo.");
}

/**
 * Executa a análise de um assessment (idempotente):
 * já processando/pronto → no-op. Retry único em resposta inválida.
 */
export async function runAnalysis(assessmentId: string): Promise<void> {
  const store = getStore();
  const assessment = store.getAssessment(assessmentId);
  if (!assessment) throw new Error("assessment_not_found");

  // Idempotência: só roda a partir de photo_pending/failed
  if (!["photo_pending", "failed"].includes(assessment.status)) return;

  const image = store.getImageByAssessment(assessmentId);
  const answers = assessment.answers;
  if (!image || !answers) throw new Error("assessment_incomplete");

  store.updateAssessment(assessmentId, { status: "processing" });
  trackEvent("analysis_started", { assessmentId, leadId: assessment.leadId });

  const input: DiagnosticInput = {
    imageBase64: readFileSync(image.storagePath).toString("base64"),
    imageMimeType: "image/jpeg",
    context: {
      segment: answers.segment,
      role: answers.role,
      targetAudience: answers.targetAudience,
      desiredPerception: answers.desiredPerception,
      desiredTraits: answers.desiredTraits,
      avoidPerceptions: answers.avoidPerceptions,
      desiredArchetypes: answers.desiredArchetypes,
    },
  };

  const provider = getProvider();

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await provider.analyze(input);
      const result = DiagnosticResultSchema.parse(raw);

      if (result.imageValidation.faceCountCategory === "none") {
        store.updateAssessment(assessmentId, { status: "failed", failureReason: "no_face" });
        trackEvent("analysis_failed", { assessmentId, payload: { reason: "no_face" } });
        return;
      }
      if (result.imageValidation.faceCountCategory === "multiple") {
        store.updateAssessment(assessmentId, {
          status: "failed",
          failureReason: "multiple_people",
        });
        trackEvent("analysis_failed", { assessmentId, payload: { reason: "multiple_people" } });
        return;
      }

      const overallScore = calculateOverallScore(result.scores);
      store.updateAssessment(assessmentId, {
        status: "free_ready",
        result,
        overallScore,
        aiProvider: provider.name,
        aiModel: provider.model,
        promptVersion: PROMPT_VERSION,
        processedAt: new Date().toISOString(),
      });
      trackEvent("analysis_completed", { assessmentId, leadId: assessment.leadId });
      return;
    } catch (err) {
      lastError = err; // única retry automática
    }
  }

  store.updateAssessment(assessmentId, { status: "failed", failureReason: "provider_error" });
  trackEvent("analysis_failed", {
    assessmentId,
    payload: { reason: "provider_error", message: String(lastError).slice(0, 200) },
  });
}
