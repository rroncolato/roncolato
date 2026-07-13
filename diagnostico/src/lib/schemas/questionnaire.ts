import { z } from "zod";
import { ARCHETYPE_IDS, MAX_DESIRED_ARCHETYPES } from "@/lib/archetypes";

export const PHOTO_USAGE_OPTIONS = [
  "whatsapp",
  "instagram",
  "linkedin",
  "site",
  "materiais-comerciais",
  "palestras",
  "imprensa",
  "assinatura-email",
  "outros",
] as const;

export const PERCEPTION_OPTIONS = [
  "acessivel",
  "especialista",
  "premium",
  "autoridade",
  "referencia",
] as const;

export const TRAIT_SUGGESTIONS = [
  "autoridade",
  "confiança",
  "proximidade",
  "inteligência",
  "criatividade",
  "segurança",
  "liderança",
  "sofisticação",
  "inovação",
  "acolhimento",
  "coragem",
  "autenticidade",
] as const;

export const AVOID_SUGGESTIONS = [
  "insegurança",
  "informalidade excessiva",
  "arrogância",
  "distanciamento",
  "rigidez",
  "amadorismo",
  "frieza",
  "aparência genérica",
] as const;

export const questionnaireSchema = z.object({
  // P1–P2
  segment: z.string().trim().min(1, "Informe seu segmento"),
  role: z.string().trim().min(1, "Informe seu cargo ou função"),
  // P3
  photoUsage: z
    .array(z.enum(PHOTO_USAGE_OPTIONS))
    .min(1, "Selecione onde a foto é utilizada"),
  // P4
  targetAudience: z.string().trim().min(3, "Descreva o público que deseja atrair"),
  // P5 (até 2)
  desiredPerception: z
    .array(z.enum(PERCEPTION_OPTIONS))
    .min(1, "Selecione ao menos uma opção")
    .max(2, "Escolha no máximo duas opções"),
  // P6 (exatamente 3, sugestões ou personalizadas)
  desiredTraits: z
    .array(z.string().trim().min(1))
    .length(3, "Escolha exatamente três características"),
  // P7
  avoidPerceptions: z
    .array(z.string().trim().min(1))
    .min(1, "Selecione ao menos uma percepção a evitar"),
  // P8 (máx 2 arquétipos)
  desiredArchetypes: z
    .array(z.enum(ARCHETYPE_IDS))
    .min(1, "Selecione ao menos um arquétipo")
    .max(MAX_DESIRED_ARCHETYPES, `Escolha no máximo ${MAX_DESIRED_ARCHETYPES} arquétipos`),
  // P9 (escala 1–5)
  currentRepresentation: z.coerce.number().int().min(1).max(5),
  // P10 (aberta)
  mainDiscomfort: z.string().trim().min(3, "Conte qual é seu maior incômodo"),
});

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;
