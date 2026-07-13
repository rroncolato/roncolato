import { z } from "zod";

/**
 * Schema da resposta estruturada da IA.
 * Validado antes de qualquer persistência. Nota geral NÃO faz parte —
 * é calculada em scoring.ts a partir dos pilares.
 */

const score = z.number().min(0).max(100);

export const DiagnosticResultSchema = z.object({
  version: z.string(),
  imageValidation: z.object({
    valid: z.boolean(),
    faceCountCategory: z.enum(["none", "single", "multiple", "uncertain"]),
    imageQuality: z.enum(["low", "medium", "high"]),
    limitation: z.string().optional(),
  }),
  visualObservations: z.object({
    expression: z.array(z.string()),
    gaze: z.array(z.string()),
    posture: z.array(z.string()),
    framing: z.array(z.string()),
    clothing: z.array(z.string()),
    background: z.array(z.string()),
    lighting: z.array(z.string()),
    technicalQuality: z.array(z.string()),
  }),
  scores: z.object({
    expression: score,
    authority: score,
    connection: score,
    visualCoherence: score,
    archetypalAlignment: score,
    perceivedValue: score,
  }),
  perceivedArchetypes: z.array(
    z.object({
      archetype: z.string(),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()).min(1),
    }),
  ),
  desiredArchetypes: z.array(z.string()),
  alignment: z.object({
    strengths: z.array(z.string()),
    conflicts: z.array(z.string()),
    summary: z.string(),
  }),
  freeResult: z.object({
    mainStrength: z.string(),
    mainGap: z.string(),
    initialRecommendation: z.string(),
    conclusion: z.string(),
  }),
  fullResult: z.object({
    introduction: z.string(),
    expressionAnalysis: z.string(),
    authorityAnalysis: z.string(),
    connectionAnalysis: z.string(),
    coherenceAnalysis: z.string(),
    archetypeAnalysis: z.string(),
    perceivedValueAnalysis: z.string(),
    practicalRecommendations: z.array(z.string()).length(5),
    strategicSummary: z.string(),
  }),
  confidence: z.number().min(0).max(1),
  limitations: z.array(z.string()),
});

export type DiagnosticResult = z.infer<typeof DiagnosticResultSchema>;
