import "server-only";
import { z } from "zod";

/**
 * Único ponto de leitura de process.env do projeto.
 * Em DEMO_MODE=true, credenciais externas são opcionais — a aplicação
 * roda 100% local com fixtures e pagamento simulado.
 */

const boolFromString = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // App
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_NAME: z.string().default("Diagnóstico de Expressão"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default(""),
    NEXT_PUBLIC_BOOKING_URL: z.string().default(""),

    // Supabase
    SUPABASE_URL: z.string().default(""),
    SUPABASE_ANON_KEY: z.string().default(""),
    SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),

    // IA
    AI_PROVIDER: z.enum(["anthropic", "demo"]).default("demo"),
    AI_API_KEY: z.string().default(""),
    AI_MODEL: z.string().default("claude-opus-4-8"),
    AI_PROMPT_VERSION: z.string().default("1.0.0"),
    AI_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000),

    // Mercado Pago
    MERCADO_PAGO_ACCESS_TOKEN: z.string().default(""),
    MERCADO_PAGO_PUBLIC_KEY: z.string().default(""),
    MERCADO_PAGO_WEBHOOK_SECRET: z.string().default(""),

    // Negócio
    FULL_REPORT_PRICE_CENTS: z.coerce.number().int().positive().default(9_700),
    IMAGE_RETENTION_DAYS: z.coerce.number().int().positive().default(180),
    MAX_IMAGE_SIZE_MB: z.coerce.number().positive().default(10),

    // Modo demonstração
    DEMO_MODE: boolFromString,

    // Admin
    ADMIN_EMAIL: z.string().default(""),
    // Login local do painel em DEMO_MODE. Em produção o Supabase Auth assume.
    ADMIN_PASSWORD: z.string().default(""),
    APP_SECRET: z.string().default(""),
  })
  .superRefine((env, ctx) => {
    if (env.DEMO_MODE) return; // demo: nada externo é obrigatório

    const required: Array<[string, string]> = [
      ["SUPABASE_URL", env.SUPABASE_URL],
      ["SUPABASE_ANON_KEY", env.SUPABASE_ANON_KEY],
      ["SUPABASE_SERVICE_ROLE_KEY", env.SUPABASE_SERVICE_ROLE_KEY],
      ["APP_SECRET", env.APP_SECRET],
    ];
    if (env.AI_PROVIDER === "anthropic") required.push(["AI_API_KEY", env.AI_API_KEY]);

    for (const [name, value] of required) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${name} é obrigatório quando DEMO_MODE=false`,
          path: [name],
        });
      }
    }
  });

function loadConfig() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Configuração de ambiente inválida:\n${issues}`);
  }
  return parsed.data;
}

export const config = loadConfig();

export const isDemoMode = config.DEMO_MODE;
