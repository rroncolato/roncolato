"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AVOID_SUGGESTIONS,
  PERCEPTION_OPTIONS,
  PHOTO_USAGE_OPTIONS,
  TRAIT_SUGGESTIONS,
  questionnaireSchema,
  type QuestionnaireInput,
} from "@/lib/schemas/questionnaire";
import { ARCHETYPES, MAX_DESIRED_ARCHETYPES, type ArchetypeId } from "@/lib/archetypes";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { OptionCard } from "@/components/ui/OptionCard";
import { Button } from "@/components/ui/Button";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { getDraft, getToken, sendEvent, setDraft } from "@/lib/journey-client";

const TOTAL_STEPS = 10;

const USAGE_LABELS: Record<(typeof PHOTO_USAGE_OPTIONS)[number], string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  site: "Site",
  "materiais-comerciais": "Materiais comerciais",
  palestras: "Palestras",
  imprensa: "Imprensa",
  "assinatura-email": "Assinatura de e-mail",
  outros: "Outros",
};

const PERCEPTION_LABELS: Record<(typeof PERCEPTION_OPTIONS)[number], string> = {
  acessivel: "Acessível",
  especialista: "Especialista",
  premium: "Premium",
  autoridade: "Autoridade",
  referencia: "Referência no mercado",
};

const SCALE_LABELS = [
  "Não representa mais",
  "Representa muito pouco",
  "Representa parcialmente",
  "Representa bem",
  "Representa completamente",
];

type Draft = Partial<QuestionnaireInput>;

function toggle<T>(list: T[], item: T, max?: number): T[] {
  if (list.includes(item)) return list.filter((i) => i !== item);
  if (max && list.length >= max) return list;
  return [...list, item];
}

export function Questionnaire() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraftState] = useState<Draft>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/diagnostico/dados");
      return;
    }
    const saved = getDraft<Draft>();
    // Restauração única do rascunho salvo (sessionStorage) após montar no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setDraftState(saved);
    sendEvent("questionnaire_started", getToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(patch: Draft) {
    const next = { ...draft, ...patch };
    setDraftState(next);
    setDraft(next);
    setError(null);
  }

  const stepValid = useMemo(() => {
    switch (step) {
      case 1: return !!draft.segment?.trim();
      case 2: return !!draft.role?.trim();
      case 3: return (draft.photoUsage?.length ?? 0) > 0;
      case 4: return (draft.targetAudience?.trim().length ?? 0) >= 3;
      case 5: return (draft.desiredPerception?.length ?? 0) >= 1;
      case 6: return (draft.desiredTraits?.length ?? 0) === 3;
      case 7: return (draft.avoidPerceptions?.length ?? 0) >= 1;
      case 8: return (draft.desiredArchetypes?.length ?? 0) >= 1;
      case 9: return !!draft.currentRepresentation;
      case 10: return (draft.mainDiscomfort?.trim().length ?? 0) >= 3;
      default: return false;
    }
  }, [step, draft]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    const parsed = questionnaireSchema.safeParse(draft);
    if (!parsed.success) {
      setError("Revise as respostas — algo ficou incompleto.");
      setSubmitting(false);
      return;
    }
    const res = await fetch(`/api/assessments/${getToken()}/answers`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      setError("Não foi possível salvar as respostas. Tente novamente.");
      setSubmitting(false);
      return;
    }
    router.push("/diagnostico/foto");
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else void submit();
  }

  return (
    <div className="flex flex-col gap-10">
      <ProgressIndicator current={step} total={TOTAL_STEPS} label="Pergunta" />

      {step === 1 && (
        <StepShell title="Qual é o seu segmento de atuação?">
          <TextField
            label="Segmento"
            placeholder="Ex.: advocacia, saúde, tecnologia..."
            value={draft.segment ?? ""}
            onChange={(e) => update({ segment: e.target.value })}
          />
        </StepShell>
      )}

      {step === 2 && (
        <StepShell title="Qual é o seu cargo ou função atualmente?">
          <TextField
            label="Cargo ou função"
            placeholder="Ex.: sócia-fundadora, diretor comercial..."
            value={draft.role ?? ""}
            onChange={(e) => update({ role: e.target.value })}
          />
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          title="Onde esta fotografia é mais utilizada?"
          hint="Selecione todas que se aplicam."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {PHOTO_USAGE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt}
                title={USAGE_LABELS[opt]}
                selected={draft.photoUsage?.includes(opt) ?? false}
                onToggle={() => update({ photoUsage: toggle(draft.photoUsage ?? [], opt) })}
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell title="Qual público você deseja atrair?">
          <TextAreaField
            label="Público desejado"
            placeholder="Ex.: empresários do setor de saúde que buscam consultoria estratégica..."
            value={draft.targetAudience ?? ""}
            onChange={(e) => update({ targetAudience: e.target.value })}
          />
        </StepShell>
      )}

      {step === 5 && (
        <StepShell
          title="Como deseja ser percebido profissionalmente?"
          hint="Escolha até duas opções."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {PERCEPTION_OPTIONS.map((opt) => (
              <OptionCard
                key={opt}
                title={PERCEPTION_LABELS[opt]}
                selected={draft.desiredPerception?.includes(opt) ?? false}
                onToggle={() =>
                  update({ desiredPerception: toggle(draft.desiredPerception ?? [], opt, 2) })
                }
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 6 && (
        <StepShell
          title="Quais três características sua imagem deveria transmitir?"
          hint={`Selecionadas: ${draft.desiredTraits?.length ?? 0} de 3.`}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {TRAIT_SUGGESTIONS.map((trait) => (
              <OptionCard
                key={trait}
                title={trait}
                selected={draft.desiredTraits?.includes(trait) ?? false}
                onToggle={() =>
                  update({ desiredTraits: toggle(draft.desiredTraits ?? [], trait, 3) })
                }
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 7 && (
        <StepShell
          title="Qual percepção você não deseja transmitir?"
          hint="Selecione as que quiser evitar."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {AVOID_SUGGESTIONS.map((item) => (
              <OptionCard
                key={item}
                title={item}
                selected={draft.avoidPerceptions?.includes(item) ?? false}
                onToggle={() =>
                  update({ avoidPerceptions: toggle(draft.avoidPerceptions ?? [], item) })
                }
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 8 && (
        <StepShell
          title="Quais arquétipos mais representam como você deseja ser percebido?"
          hint={`Escolha até ${MAX_DESIRED_ARCHETYPES}. Arquétipos são linguagens de percepção visual.`}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {ARCHETYPES.map((arch) => (
              <OptionCard
                key={arch.id}
                title={arch.name}
                description={arch.essence}
                selected={draft.desiredArchetypes?.includes(arch.id) ?? false}
                onToggle={() =>
                  update({
                    desiredArchetypes: toggle(
                      (draft.desiredArchetypes ?? []) as ArchetypeId[],
                      arch.id,
                      MAX_DESIRED_ARCHETYPES,
                    ),
                  })
                }
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 9 && (
        <StepShell title="Quanto esta fotografia representa seu momento profissional atual?">
          <div className="space-y-3">
            {SCALE_LABELS.map((label, i) => (
              <OptionCard
                key={label}
                title={`${i + 1} — ${label}`}
                selected={draft.currentRepresentation === i + 1}
                onToggle={() => update({ currentRepresentation: i + 1 })}
              />
            ))}
          </div>
        </StepShell>
      )}

      {step === 10 && (
        <StepShell title="Qual é seu maior incômodo com sua imagem atual?">
          <TextAreaField
            label="Conte com suas palavras"
            placeholder="O que mais te incomoda quando vê sua foto atual?"
            value={draft.mainDiscomfort ?? ""}
            onChange={(e) => update({ mainDiscomfort: e.target.value })}
          />
        </StepShell>
      )}

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || submitting}
        >
          Voltar
        </Button>
        <Button type="button" onClick={next} disabled={!stepValid || submitting}>
          {step === TOTAL_STEPS ? (submitting ? "Salvando..." : "Concluir") : "Avançar"}
        </Button>
      </div>
    </div>
  );
}

function StepShell({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="text-[length:var(--text-subtitle)] leading-snug">{title}</h1>
      {hint && <p className="mt-2 text-sm text-ink-muted">{hint}</p>}
      <GoldDivider className="my-6" />
      {children}
    </section>
  );
}
