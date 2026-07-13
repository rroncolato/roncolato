import type { DiagnosticResult } from "@/lib/schemas/diagnostic-result";

/**
 * Camada independente de provedor de IA.
 * Implementações: anthropic (real), demo (fixture).
 * Toda chamada acontece no servidor; nenhuma chave chega ao navegador.
 */

export type DiagnosticInput = {
  /** Imagem já processada (EXIF removido, redimensionada), base64. */
  imageBase64: string;
  imageMimeType: "image/jpeg" | "image/png" | "image/webp";
  /** Contexto mínimo do lead — nada além do necessário. */
  context: {
    segment: string;
    role: string;
    targetAudience: string;
    desiredPerception: string[];
    desiredTraits: string[];
    avoidPerceptions: string[];
    desiredArchetypes: string[];
  };
};

export interface VisionDiagnosticProvider {
  readonly name: string;
  readonly model: string;
  analyze(input: DiagnosticInput): Promise<DiagnosticResult>;
}

export class DiagnosticProviderError extends Error {
  constructor(
    message: string,
    public readonly kind: "timeout" | "unavailable" | "invalid_response" | "unknown",
  ) {
    super(message);
    this.name = "DiagnosticProviderError";
  }
}
