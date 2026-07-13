import { describe, expect, it } from "vitest";
import { DiagnosticResultSchema } from "./diagnostic-result";
import { DEMO_RESULT } from "@/lib/ai/fixtures/demo-result";

describe("DiagnosticResultSchema", () => {
  it("aceita a fixture demo", () => {
    expect(() => DiagnosticResultSchema.parse(DEMO_RESULT)).not.toThrow();
  });

  it("rejeita nota de pilar acima de 100", () => {
    const bad = structuredClone(DEMO_RESULT);
    bad.scores.authority = 120;
    expect(DiagnosticResultSchema.safeParse(bad).success).toBe(false);
  });

  it("rejeita nota de pilar negativa", () => {
    const bad = structuredClone(DEMO_RESULT);
    bad.scores.expression = -1;
    expect(DiagnosticResultSchema.safeParse(bad).success).toBe(false);
  });

  it("exige exatamente 5 recomendações práticas", () => {
    const four = structuredClone(DEMO_RESULT);
    four.fullResult.practicalRecommendations = four.fullResult.practicalRecommendations.slice(0, 4);
    expect(DiagnosticResultSchema.safeParse(four).success).toBe(false);

    const six = structuredClone(DEMO_RESULT);
    six.fullResult.practicalRecommendations = [
      ...six.fullResult.practicalRecommendations,
      "extra",
    ];
    expect(DiagnosticResultSchema.safeParse(six).success).toBe(false);
  });

  it("exige evidência em arquétipo percebido", () => {
    const bad = structuredClone(DEMO_RESULT);
    bad.perceivedArchetypes[0].evidence = [];
    expect(DiagnosticResultSchema.safeParse(bad).success).toBe(false);
  });

  it("confidence entre 0 e 1", () => {
    const bad = structuredClone(DEMO_RESULT);
    bad.confidence = 1.5;
    expect(DiagnosticResultSchema.safeParse(bad).success).toBe(false);
  });

  it("rejeita JSON sem campos obrigatórios", () => {
    expect(DiagnosticResultSchema.safeParse({}).success).toBe(false);
  });
});
