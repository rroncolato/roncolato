import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_RESULT } from "./fixtures/demo-result";
import { DiagnosticProviderError, type DiagnosticInput } from "./provider";

const parseMock = vi.fn();

vi.mock("@/lib/config", () => ({
  config: {
    AI_API_KEY: "test-key",
    AI_MODEL: "claude-opus-4-8",
    AI_TIMEOUT_MS: 1000,
  },
  isDemoMode: true,
}));

vi.mock("@anthropic-ai/sdk", async (importOriginal) => {
  const original = await importOriginal<typeof import("@anthropic-ai/sdk")>();
  class MockAnthropic {
    messages = { parse: parseMock };
  }
  // Preserva as classes de erro reais do SDK para os testes de mapeamento
  Object.assign(MockAnthropic, {
    APIError: original.default.APIError,
    APIConnectionError: original.default.APIConnectionError,
    APIConnectionTimeoutError: original.default.APIConnectionTimeoutError,
    RateLimitError: original.default.RateLimitError,
    InternalServerError: original.default.InternalServerError,
  });
  return { default: MockAnthropic };
});

const input: DiagnosticInput = {
  imageBase64: "aGVsbG8=",
  imageMimeType: "image/jpeg",
  context: {
    segment: "Consultoria",
    role: "Diretor",
    targetAudience: "Empresários",
    desiredPerception: ["autoridade"],
    desiredTraits: ["autoridade", "confiança", "sofisticação"],
    avoidPerceptions: ["amadorismo"],
    desiredArchetypes: ["sabio"],
  },
};

describe("AnthropicDiagnosticProvider", () => {
  beforeEach(() => {
    parseMock.mockReset();
  });

  async function makeProvider() {
    const { AnthropicDiagnosticProvider } = await import("./anthropic");
    return new AnthropicDiagnosticProvider();
  }

  it("retorna resultado validado quando o parse funciona", async () => {
    parseMock.mockResolvedValue({
      parsed_output: DEMO_RESULT,
      stop_reason: "end_turn",
      usage: { input_tokens: 100, output_tokens: 200 },
    });
    const provider = await makeProvider();
    const result = await provider.analyze(input);
    expect(result.scores.expression).toBe(DEMO_RESULT.scores.expression);
    expect(parseMock).toHaveBeenCalledOnce();
  });

  it("não envia dados do lead além do contexto mínimo", async () => {
    parseMock.mockResolvedValue({
      parsed_output: DEMO_RESULT,
      stop_reason: "end_turn",
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    const provider = await makeProvider();
    await provider.analyze(input);
    const sent = JSON.stringify(parseMock.mock.calls[0][0]);
    expect(sent).not.toMatch(/nome|email|whatsapp|telefone/i);
    expect(sent).toContain("Consultoria");
  });

  it("erro invalid_response quando parsed_output ausente", async () => {
    parseMock.mockResolvedValue({
      parsed_output: null,
      stop_reason: "end_turn",
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    const provider = await makeProvider();
    await expect(provider.analyze(input)).rejects.toMatchObject({
      name: "DiagnosticProviderError",
      kind: "invalid_response",
    });
  });

  it("erro invalid_response em refusal", async () => {
    parseMock.mockResolvedValue({
      parsed_output: null,
      stop_reason: "refusal",
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    const provider = await makeProvider();
    await expect(provider.analyze(input)).rejects.toMatchObject({
      kind: "invalid_response",
    });
  });

  it("mapeia timeout do SDK para kind=timeout", async () => {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    parseMock.mockRejectedValue(new Anthropic.APIConnectionTimeoutError());
    const provider = await makeProvider();
    await expect(provider.analyze(input)).rejects.toMatchObject({ kind: "timeout" });
  });

  it("erros desconhecidos viram DiagnosticProviderError", async () => {
    parseMock.mockRejectedValue(new Error("boom"));
    const provider = await makeProvider();
    await expect(provider.analyze(input)).rejects.toBeInstanceOf(DiagnosticProviderError);
  });
});
