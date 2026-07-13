import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { archetypeById } from "@/lib/archetypes";
import { trackEvent } from "@/lib/events";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { ScoreGauge } from "@/components/diagnostic/ScoreGauge";

export default async function ResultadoPage({
  params,
}: PageProps<"/diagnostico/resultado/[token]">) {
  const { token } = await params;
  if (!isValidTokenFormat(token)) notFound();

  const store = getStore();
  const assessment = store.getAssessmentByToken(token);
  if (
    !assessment ||
    !assessment.result ||
    assessment.overallScore === undefined ||
    !["free_ready", "paid"].includes(assessment.status)
  ) {
    notFound();
  }

  const { result, overallScore } = assessment;
  const free = result.freeResult;
  const mainPerceived = result.perceivedArchetypes[0];
  const perceivedInfo = mainPerceived ? archetypeById(mainPerceived.archetype) : undefined;

  trackEvent("free_result_viewed", {
    assessmentId: assessment.id,
    leadId: assessment.leadId,
  });

  return (
    <main className="flex-1 space-y-16 pb-24">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          Diagnóstico de Expressão
        </p>
        <h1 className="mt-4 text-[length:var(--text-title)]">
          O que sua imagem comunica hoje
        </h1>
        <GoldDivider className="my-8" />
      </header>

      <section className="flex justify-center">
        <ScoreGauge score={overallScore} />
      </section>

      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Arquétipo predominante percebido
        </h2>
        <div className="mt-4 border border-line bg-surface p-8">
          <p className="font-display text-2xl tracking-wide">
            {perceivedInfo?.name ?? mainPerceived?.archetype}
          </p>
          {perceivedInfo && (
            <p className="mt-2 text-sm text-ink-muted">{perceivedInfo.essence}</p>
          )}
          {mainPerceived && (
            <ul className="mt-6 space-y-2 border-t border-line pt-4 text-sm text-ink-muted">
              {mainPerceived.evidence.slice(0, 2).map((ev) => (
                <li key={ev} className="flex gap-3">
                  <span aria-hidden className="text-accent">
                    —
                  </span>
                  {ev}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
            Principal força
          </h2>
          <p className="mt-4 text-ink-muted">{free.mainStrength}</p>
        </div>
        <div>
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
            Principal distância
          </h2>
          <p className="mt-4 text-ink-muted">{free.mainGap}</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-accent">
          Recomendação inicial
        </h2>
        <p className="mt-4 text-ink-muted">{free.initialRecommendation}</p>
      </section>

      <section className="border-l border-accent pl-6">
        <p className="font-display text-lg leading-relaxed text-ink">{free.conclusion}</p>
      </section>

      <section className="border border-line bg-secondary/60 p-8 sm:p-12">
        <h2 className="text-[length:var(--text-subtitle)]">
          Existe mais informação nesta imagem do que parece.
        </h2>
        <GoldDivider className="my-6" />
        <p className="text-ink-muted">
          Seu diagnóstico completo revela os pontos que fortalecem sua
          autoridade, os conflitos entre intenção e percepção e as mudanças que
          podem aproximar sua imagem do posicionamento que você deseja ocupar.
        </p>
        <div className="mt-8">
          <Link
            href={`/diagnostico/completo/${token}`}
            className="inline-flex min-h-[48px] items-center justify-center bg-accent px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors hover:bg-accent-hover"
          >
            Desbloquear diagnóstico completo
          </Link>
        </div>
      </section>

      <p className="text-center text-xs text-ink-muted">
        Guarde este link — ele é seu acesso pessoal ao resultado.
      </p>
    </main>
  );
}
