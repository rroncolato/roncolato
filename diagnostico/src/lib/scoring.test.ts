import { describe, expect, it } from "vitest";
import { calculateOverallScore, scoreBand, PILLAR_WEIGHTS, type PillarScores } from "./scoring";

const allEqual = (v: number): PillarScores => ({
  expression: v,
  authority: v,
  connection: v,
  visualCoherence: v,
  archetypalAlignment: v,
  perceivedValue: v,
});

describe("calculateOverallScore", () => {
  it("pesos somam 1", () => {
    const total = Object.values(PILLAR_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1);
  });

  it("pilares iguais → nota igual", () => {
    expect(calculateOverallScore(allEqual(0))).toBe(0);
    expect(calculateOverallScore(allEqual(50))).toBe(50);
    expect(calculateOverallScore(allEqual(100))).toBe(100);
  });

  it("aplica pesos corretamente", () => {
    // expression 100, resto 0 → 20
    expect(calculateOverallScore({ ...allEqual(0), expression: 100 })).toBe(20);
    // perceivedValue 100, resto 0 → 10
    expect(calculateOverallScore({ ...allEqual(0), perceivedValue: 100 })).toBe(10);
    // connection 100, resto 0 → 15
    expect(calculateOverallScore({ ...allEqual(0), connection: 100 })).toBe(15);
  });

  it("clampa valores fora de 0–100", () => {
    expect(calculateOverallScore(allEqual(150))).toBe(100);
    expect(calculateOverallScore(allEqual(-50))).toBe(0);
  });

  it("NaN vira 0, não propaga", () => {
    expect(calculateOverallScore({ ...allEqual(50), expression: NaN })).toBe(40);
  });

  it("fixture demo: 62/55/70/58/48/52 → 57", () => {
    expect(
      calculateOverallScore({
        expression: 62,
        authority: 55,
        connection: 70,
        visualCoherence: 58,
        archetypalAlignment: 48,
        perceivedValue: 52,
      }),
    ).toBe(57);
  });
});

describe("scoreBand", () => {
  it("faixas corretas nos limites", () => {
    expect(scoreBand(0).label).toBe("Imagem desalinhada");
    expect(scoreBand(39).label).toBe("Imagem desalinhada");
    expect(scoreBand(40).label).toBe("Imagem parcialmente coerente");
    expect(scoreBand(59).label).toBe("Imagem parcialmente coerente");
    expect(scoreBand(60).label).toBe("Boa base de posicionamento");
    expect(scoreBand(74).label).toBe("Boa base de posicionamento");
    expect(scoreBand(75).label).toBe("Imagem forte e consistente");
    expect(scoreBand(89).label).toBe("Imagem forte e consistente");
    expect(scoreBand(90).label).toBe("Imagem altamente alinhada");
    expect(scoreBand(100).label).toBe("Imagem altamente alinhada");
  });
});
