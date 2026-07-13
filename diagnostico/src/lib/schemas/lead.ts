import { z } from "zod";

/** Telefone brasileiro: DDD (2 dígitos, 1º ≠ 0) + 8/9 dígitos. Aceita máscara. */
export const brPhoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((digits) => {
    const local = digits.startsWith("55") ? digits.slice(2) : digits;
    return /^[1-9][0-9]((9[0-9]{8})|([2-5][0-9]{7}))$/.test(local);
  }, "Informe um WhatsApp brasileiro válido com DDD");

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo")
    .refine((v) => v.split(/\s+/).length >= 2, "Informe nome e sobrenome"),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido"),
  whatsapp: brPhoneSchema,
  company: z.string().trim().min(1, "Informe sua empresa ou marca"),
  role: z.string().trim().min(1, "Informe seu cargo ou função"),
  segment: z.string().trim().min(1, "Informe seu segmento"),
  instagram: z.string().trim().optional().or(z.literal("")),
  linkedin: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  contactOrigin: z.string().trim().optional().or(z.literal("")),
  consentContact: z.literal(true, {
    message: "É necessário autorizar o contato para receber o diagnóstico",
  }),
  consentMarketing: z.boolean().default(false),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const utmSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  landing_page: z.string().optional(),
  referral_code: z.string().optional(),
});

export type UtmParams = z.infer<typeof utmSchema>;
