import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoldDivider } from "@/components/ui/GoldDivider";

export const metadata = { title: "Termos de Uso — Diagnóstico de Expressão" };

export default function TermosPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <BrandLogo />
      <h1 className="mt-10 text-[length:var(--text-title)]">Termos de Uso</h1>
      <GoldDivider className="my-8" />
      <div className="space-y-6 text-sm leading-relaxed text-ink-muted">
        <h2 className="font-display text-base text-ink">Natureza do serviço</h2>
        <p>
          O Diagnóstico de Expressão é uma leitura estratégica do que uma
          fotografia comunica visualmente. Não é avaliação psicológica, laudo
          ou diagnóstico clínico de qualquer natureza. Os arquétipos são
          utilizados como linguagem de percepção visual.
        </p>
        <h2 className="font-display text-base text-ink">Uso adequado</h2>
        <p>
          Envie apenas fotografias suas, das quais você detém os direitos. É
          vedado enviar imagens de terceiros sem autorização.
        </p>
        <h2 className="font-display text-base text-ink">Resultado</h2>
        <p>
          A análise é gerada por inteligência artificial a partir de sinais
          visuais observáveis e tem caráter orientativo. O relatório completo,
          quando adquirido, é liberado após a confirmação do pagamento.
        </p>
        <h2 className="font-display text-base text-ink">Acesso</h2>
        <p>
          O acesso ao resultado é feito por link pessoal com token seguro.
          Mantenha seu link em segurança — ele é o seu acesso.
        </p>
        <p>Dúvidas: rodrigo@rroncolato.com.</p>
      </div>
    </main>
  );
}
