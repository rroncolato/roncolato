import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { StartTracker } from "@/components/diagnostic/StartTracker";

export default function DiagnosticoIntroPage() {
  return (
    <main className="flex flex-1 flex-col justify-center pb-16">
      <StartTracker />
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Como funciona</p>
      <h1 className="mt-4 text-[length:var(--text-title)]">
        Uma leitura estratégica da sua imagem
      </h1>
      <GoldDivider className="my-8" />

      <div className="space-y-6 text-ink-muted">
        <p>
          Em poucos minutos, você responde dez perguntas sobre seu momento
          profissional e envia a fotografia que usa hoje.
        </p>
        <p>
          A análise observa seis pilares — expressão, autoridade, conexão,
          coerência visual, alinhamento arquetípico e valor percebido — e mostra
          a distância entre o que sua imagem comunica e o posicionamento que
          você deseja ocupar.
        </p>
        <p className="text-sm">
          A leitura fala sobre o que a fotografia comunica — nunca sobre quem
          você é. Sua imagem não será publicada e você pode solicitar a
          exclusão a qualquer momento.
        </p>
      </div>

      <div className="mt-12">
        <Link
          href="/diagnostico/dados"
          className="inline-flex min-h-[48px] items-center justify-center bg-accent px-10 py-4 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors duration-300 hover:bg-accent-hover"
        >
          Começar
        </Link>
      </div>
    </main>
  );
}
