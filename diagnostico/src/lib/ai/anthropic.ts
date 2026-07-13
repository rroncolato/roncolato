import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { DiagnosticInput, VisionDiagnosticProvider } from "./provider";
import { DiagnosticProviderError } from "./provider";
import { DiagnosticResultSchema, type DiagnosticResult } from "@/lib/schemas/diagnostic-result";
import { SYSTEM_PROMPT } from "./prompts/system";
import { buildDiagnosticPrompt } from "./prompts/diagnostic";
import { config } from "@/lib/config";

/**
 * Adapter real: Anthropic vision + structured outputs.
 * A resposta chega validada pelo schema (parse); ainda assim o chamador
 * (analysis.ts) revalida e aplica o retry único.
 */
export class AnthropicDiagnosticProvider implements VisionDiagnosticProvider {
  readonly name = "anthropic";
  readonly model: string;
  private client: Anthropic;

  constructor() {
    if (!config.AI_API_KEY) {
      throw new DiagnosticProviderError("AI_API_KEY ausente", "unavailable");
    }
    this.model = config.AI_MODEL;
    this.client = new Anthropic({
      apiKey: config.AI_API_KEY,
      timeout: config.AI_TIMEOUT_MS, // ms
      maxRetries: 1,
    });
  }

  async analyze(input: DiagnosticInput): Promise<DiagnosticResult> {
    try {
      const response = await this.client.messages.parse({
        model: this.model,
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        output_config: { format: zodOutputFormat(DiagnosticResultSchema) },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: input.imageMimeType,
                  data: input.imageBase64,
                },
              },
              { type: "text", text: buildDiagnosticPrompt(input.context) },
            ],
          },
        ],
      });

      // Registro de uso — sem nenhum dado da imagem ou do lead.
      console.info(
        `[ai] provider=anthropic model=${this.model} in=${response.usage.input_tokens} out=${response.usage.output_tokens}`,
      );

      if (response.stop_reason === "refusal") {
        throw new DiagnosticProviderError("Análise recusada pelo provedor", "invalid_response");
      }
      if (!response.parsed_output) {
        throw new DiagnosticProviderError("Resposta sem JSON válido", "invalid_response");
      }
      return response.parsed_output;
    } catch (err) {
      if (err instanceof DiagnosticProviderError) throw err;
      if (err instanceof Anthropic.APIConnectionTimeoutError) {
        throw new DiagnosticProviderError("Timeout na análise", "timeout");
      }
      if (err instanceof Anthropic.APIConnectionError) {
        throw new DiagnosticProviderError("Provedor indisponível", "unavailable");
      }
      if (err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError) {
        throw new DiagnosticProviderError("Provedor sobrecarregado", "unavailable");
      }
      if (err instanceof Anthropic.APIError) {
        throw new DiagnosticProviderError(`Erro do provedor (${err.status})`, "unknown");
      }
      throw new DiagnosticProviderError(String(err).slice(0, 200), "unknown");
    }
  }
}
