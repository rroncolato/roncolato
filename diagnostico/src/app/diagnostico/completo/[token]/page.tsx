import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { archetypeById } from "@/lib/archetypes";
import { trackEvent } from "@/lib/events";
import { getEffectiveSettings, formatPriceBRL } from "@/lib/settings";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { ScoreGauge } from "@/components/diagnostic/ScoreGauge";
import { PillarScore } from "@/components/diagnostic/PillarScore";
import { UpgradeButton } from "@/components/diagnostic/UpgradeButton";
import { BookingCTA, PrintButton } from "@/components/diagnostic/ReportCTAs";

const PILLAR_LABELS: Array<[keyof import("@/lib/schemas/diagnostic-result").DiagnosticResult["scores"], string]> = [
  ["expression", "Expressão"],
  ["authority", "Autoridade"],
  ["connection", "Conexão"],
  ["visualCoherence", "Coerência visual"],
  ["archetypalAlignment", "Alinhamento arquetípico"],
  ["perceivedValue", "Valor percebido"],
];

export default async function CompletoPage({
  params,
}: PageProps<"/diagnostico/completo/[token]">) {
  const { token } = await params;
  if (!isValidTokenFormat(token)) notFound();

  const store = getStore();
  const assessment = store.getAssessmentByToken(token);
  if (!assessment || !assessment.result || assessment.overallScore === undefined) notFound();
  const settings = getEffectiveSettings();

  // ── Não pago: oferta ─────────────────────────────────────────────
  if (assessment.status !== "paid") {
    return (
      <main className="flex flex-1 flex-col justify-center pb-24">
        <h1 className="text-[length:var(--text-title)]">
          Existe mais informação nesta imagem do que parece.
        </h1>
        <GoldDivider className="my-8" />
        <p className="max-w-xl text-ink-muted">
          Seu diagnóstico completo revela os pontos que fortalecem sua
          autoridade, os conflitos entre intenção e percepção e as mudanças que
          podem aproximar sua imagem do posicionamento que você deseja ocupar.
        </p>
        <ul className="mt-8 max-w-xl space-y-2 text-sm text-ink-muted">
          {[
            "Pontuação detalhada dos seis pilares",
            "Leitura de expressão, olhar, postura, enquadramento, vestuário, fundo e luz",
            "Comparação entre arquétipos desejados e percebidos",
            "Cinco recomendações práticas para sua próxima imagem",
            "Síntese estratégica e direção",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="text-accent">—</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-display text-2xl text-ink">
          {formatPriceBRL(settings.fullReportPriceCents)}
        </p>
        <div className="mt-6">
          <UpgradeButton token={token} label="Desbloquear diagnóstico completo" />
        </div>
        <div className="mt-10">
          <Link
            href={`/diagnostico/resultado/${token}`}
            className="text-xs uppercase tracking-[0.15em] text-ink-muted hover:text-ink"
          >
            ← Voltar ao resultado gratuito
          </Link>
        </div>
      </main>
    );
  }

  // ── Pago: relatório completo ─────────────────────────────────────
  const { result, overallScore } = assessment;
  const full = result.fullResult;
  const perceived = result.perceivedArchetypes;
  const mainPerceived = perceived[0];
  const secondPerceived = perceived[1];

  trackEvent("full_report_viewed", { assessmentId: assessment.id, leadId: assessment.leadId });

  const desiredNames = assessment.desiredArchetypes
    .map((id) => archetypeById(id)?.name ?? id)
    .join(" · ");

  const readings: Array<[string, string[]]> = [
    ["Leitura da expressão", result.visualObservations.expression],
    ["Leitura do olhar", result.visualObservations.gaze],
    ["Leitura da postura visível", result.visualObservations.posture],
    ["Leitura do enquadramento", result.visualObservations.framing],
    ["Leitura do vestuário", result.visualObservations.clothing],
    ["Leitura do fundo e ambiente", result.visualObservations.background],
    ["Leitura da iluminação", result.visualObservations.lighting],
    ["Leitura da qualidade técnica", result.visualObservations.technicalQuality],
  ];

  return (
    <main className="flex-1 space-y-16 pb-24 print:space-y-8 print:text-black">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Diagnóstico de Expressão — Relatório Completo
          </p>
          <h1 className="mt-4 text-[length:var(--text-title)]">Sua leitura estratégica</h1>
        </div>
        <PrintButton />
      </header>
      <GoldDivider />

      {/* 1. Introdução */}
      <section>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{full.introduction}</p>
      </section>

      {/* 2–3. Pontuações */}
      <section className="grid gap-12 sm:grid-cols-[auto_1fr] sm:items-center">
        <ScoreGauge score={overallScore} />
        <div className="space-y-5">
          {PILLAR_LABELS.map(([key, label]) => (
            <PillarScore key={key} label={label} score={result.scores[key]} />
          ))}
        </div>
      </section>

      {/* 5–8. Arquétipos */}
      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Arquétipos — percepção × intenção
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Percebido na imagem</p>
            <p className="mt-2 font-display text-xl">
              {archetypeById(mainPerceived?.archetype ?? "")?.name ?? mainPerceived?.archetype}
              {secondPerceived &&
                ` · ${archetypeById(secondPerceived.archetype)?.name ?? secondPerceived.archetype}`}
            </p>
          </div>
          <div className="border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Desejado por você</p>
            <p className="mt-2 font-display text-xl">{desiredNames}</p>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-ink-muted">{full.archetypeAnalysis}</p>
        {result.alignment.conflicts.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            {result.alignment.conflicts.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden className="text-accent">—</span>
                {c}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 9–16. Leituras por dimensão */}
      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          O que cada elemento comunica
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {readings.map(([title, items]) => (
            <div key={title}>
              <h3 className="font-display text-base tracking-wide text-ink">{title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                {items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-accent">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 17–19. Leituras estratégicas */}
      <section className="space-y-10">
        {[
          ["Leitura de expressão", full.expressionAnalysis],
          ["Leitura de autoridade", full.authorityAnalysis],
          ["Leitura de conexão", full.connectionAnalysis],
          ["Leitura de coerência", full.coherenceAnalysis],
          ["Leitura de valor percebido", full.perceivedValueAnalysis],
        ].map(([title, text]) => (
          <div key={title}>
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-ink-muted">{text}</p>
          </div>
        ))}
      </section>

      {/* 20. Recomendações */}
      <section className="border border-line bg-secondary/60 p-8 sm:p-10">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Cinco recomendações práticas
        </h2>
        <ol className="mt-6 space-y-4">
          {full.practicalRecommendations.map((rec, i) => (
            <li key={rec} className="flex gap-4">
              <span className="font-display text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink-muted">{rec}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 21. Síntese */}
      <section className="border-l border-accent pl-6">
        <p className="max-w-2xl font-display text-lg leading-relaxed text-ink">
          {full.strategicSummary}
        </p>
      </section>

      {result.limitations.length > 0 && (
        <section>
          <p className="text-xs text-ink-muted">
            Limitações desta leitura: {result.limitations.join("; ")}.
          </p>
        </section>
      )}

      {/* 22. CTA final */}
      <section className="border-t border-line pt-12 print:hidden">
        <h2 className="text-[length:var(--text-subtitle)]">
          A fotografia mostra o sinal. A estratégia revela a direção.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted">
          Agende uma Sessão Estratégica de Imagem de 1 hora com Rodrigo
          Roncolato para aprofundar seu momento profissional, seus arquétipos e
          o posicionamento que sua próxima imagem precisa construir.
        </p>
        <div className="mt-8">
          <BookingCTA
            token={token}
            bookingUrl={settings.bookingUrl}
            whatsappNumber={settings.whatsappNumber}
          />
        </div>
      </section>
    </main>
  );
}
