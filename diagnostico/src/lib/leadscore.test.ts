import { describe, expect, it } from "vitest";
import { calculateLeadScore, classifyLead, isLeadershipRole } from "./leadscore";

describe("calculateLeadScore", () => {
  it("sem sinais → 0", () => {
    expect(calculateLeadScore({})).toBe(0);
  });

  it("soma sinais ativos", () => {
    expect(calculateLeadScore({ premiumPerception: true, leadershipRole: true })).toBe(27);
  });

  it("compra + agendamento pesam mais", () => {
    expect(calculateLeadScore({ purchasedFullReport: true, bookingClicked: true })).toBe(45);
  });
});

describe("classifyLead", () => {
  it("classifica por faixas", () => {
    expect(classifyLead(0)).toBe("frio");
    expect(classifyLead(19)).toBe("frio");
    expect(classifyLead(20)).toBe("morno");
    expect(classifyLead(44)).toBe("morno");
    expect(classifyLead(45)).toBe("qualificado");
    expect(classifyLead(69)).toBe("qualificado");
    expect(classifyLead(70)).toBe("oportunidade");
    expect(classifyLead(140)).toBe("oportunidade");
  });
});

describe("isLeadershipRole", () => {
  it("detecta cargos de liderança", () => {
    expect(isLeadershipRole("CEO")).toBe(true);
    expect(isLeadershipRole("Diretora Comercial")).toBe(true);
    expect(isLeadershipRole("Sócio-fundador")).toBe(true);
    expect(isLeadershipRole("Analista Júnior")).toBe(false);
  });
});
