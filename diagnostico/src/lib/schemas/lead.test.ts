import { describe, expect, it } from "vitest";
import { brPhoneSchema, leadSchema } from "./lead";

describe("brPhoneSchema", () => {
  it("aceita celular com DDD e 9 dígitos", () => {
    expect(brPhoneSchema.safeParse("62985928423").success).toBe(true);
    expect(brPhoneSchema.safeParse("(62) 98592-8423").success).toBe(true);
    expect(brPhoneSchema.safeParse("+55 62 98592-8423").success).toBe(true);
  });

  it("aceita fixo com DDD e 8 dígitos", () => {
    expect(brPhoneSchema.safeParse("6232215566").success).toBe(true);
  });

  it("rejeita números inválidos", () => {
    expect(brPhoneSchema.safeParse("123").success).toBe(false);
    expect(brPhoneSchema.safeParse("985928423").success).toBe(false); // sem DDD
    expect(brPhoneSchema.safeParse("02985928423").success).toBe(false); // DDD com 0
    expect(brPhoneSchema.safeParse("abc").success).toBe(false);
  });
});

describe("leadSchema", () => {
  const valid = {
    name: "Rodrigo Roncolato",
    email: "TESTE@exemplo.com",
    whatsapp: "(62) 98592-8423",
    company: "Estúdio Roncolato",
    role: "Fundador",
    segment: "Fotografia",
    consentContact: true,
    consentMarketing: false,
  };

  it("aceita lead válido e normaliza e-mail", () => {
    const parsed = leadSchema.parse(valid);
    expect(parsed.email).toBe("teste@exemplo.com");
    expect(parsed.whatsapp).toBe("62985928423");
  });

  it("exige nome e sobrenome", () => {
    expect(leadSchema.safeParse({ ...valid, name: "Rodrigo" }).success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    expect(leadSchema.safeParse({ ...valid, email: "nao-eh-email" }).success).toBe(false);
  });

  it("exige consentimento de contato", () => {
    expect(leadSchema.safeParse({ ...valid, consentContact: false }).success).toBe(false);
  });

  it("campos opcionais podem faltar", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });
});
