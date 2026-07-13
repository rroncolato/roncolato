"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { getToken } from "@/lib/journey-client";

const PHRASES = [
  "Observando os sinais de expressão.",
  "Identificando os códigos de autoridade.",
  "Comparando percepção e intenção.",
  "Reconhecendo os arquétipos comunicados.",
  "Organizando sua leitura estratégica.",
];

const FAILURE_MESSAGES: Record<string, string> = {
  no_face:
    "Não conseguimos identificar com clareza uma pessoa nesta fotografia. Escolha uma imagem em que seu rosto esteja mais visível.",
  multiple_people:
    "Para que o diagnóstico seja preciso, envie uma fotografia em que apenas você seja o destaque principal.",
  provider_error:
    "Não foi possível concluir a análise agora. Tente novamente em instantes.",
};

export function AnalysisLoader() {
  const router = useRouter();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [failure, setFailure] = useState<string | null>(null);
  const started = useRef(false);

  // Alterna frases (sem barra de tempo falsa)
  useEffect(() => {
    const interval = setInterval(
      () => setPhraseIndex((i) => (i + 1) % PHRASES.length),
      2800,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/diagnostico/dados");
      return;
    }
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    async function run() {
      // Dispara a análise (idempotente no servidor)
      await fetch(`/api/assessments/${token}/analyze`, { method: "POST" }).catch(() => null);

      // Poll de status
      for (let i = 0; i < 60 && !cancelled; i++) {
        const res = await fetch(`/api/assessments/${token}`).catch(() => null);
        if (res?.ok) {
          const data = (await res.json()) as { status: string; failureReason?: string };
          if (["free_ready", "paid"].includes(data.status)) {
            router.replace(`/diagnostico/resultado/${token}`);
            return;
          }
          if (data.status === "failed") {
            setFailure(FAILURE_MESSAGES[data.failureReason ?? "provider_error"]);
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) setFailure(FAILURE_MESSAGES.provider_error);
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failure) {
    return (
      <div className="max-w-md space-y-6">
        <h1 className="text-[length:var(--text-subtitle)]">
          Precisamos de outra fotografia
        </h1>
        <GoldDivider className="mx-auto" />
        <p className="text-ink-muted">{failure}</p>
        <Link
          href="/diagnostico/foto"
          className="inline-flex min-h-[48px] items-center justify-center bg-accent px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-primary hover:bg-accent-hover"
        >
          Enviar outra imagem
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-8">
      <h1 className="text-[length:var(--text-title)]">Sua imagem já começou a falar.</h1>
      <GoldDivider className="mx-auto" />
      <p aria-live="polite" className="min-h-[2rem] text-ink-muted">
        {PHRASES[phraseIndex]}
      </p>
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-line border-t-accent motion-reduce:animate-none" />
    </div>
  );
}
