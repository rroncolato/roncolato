import type { DiagnosticInput, VisionDiagnosticProvider } from "./provider";
import type { DiagnosticResult } from "@/lib/schemas/diagnostic-result";
import { DiagnosticResultSchema } from "@/lib/schemas/diagnostic-result";
import { DEMO_RESULT } from "./fixtures/demo-result";

/**
 * Adapter de demonstração: nenhuma chamada externa.
 * Simula latência de processamento e ecoa os arquétipos desejados do input.
 */
export class DemoDiagnosticProvider implements VisionDiagnosticProvider {
  readonly name = "demo";
  readonly model = "fixture-v1";

  constructor(private readonly delayMs = 2500) {}

  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    await new Promise((r) => setTimeout(r, this.delayMs));
    const result: DiagnosticResult = {
      ...DEMO_RESULT,
      desiredArchetypes: input.context.desiredArchetypes,
    };
    // Mesmo a fixture passa pela validação — garante schema sempre íntegro.
    return DiagnosticResultSchema.parse(result);
  }
}
