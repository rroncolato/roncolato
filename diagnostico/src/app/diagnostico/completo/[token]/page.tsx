import { notFound } from "next/navigation";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { isValidTokenFormat } from "@/lib/tokens";
import { GoldDivider } from "@/components/ui/GoldDivider";

/**
 * Relatório completo — protegido por pagamento.
 * Checkout e liberação via webhook entram na Fase 4; até lá, quem não
 * pagou vê a oferta.
 */
export default async function CompletoPage({
  params,
}: PageProps<"/diagnostico/completo/[token]">) {
  const { token } = await params;
  if (!isValidTokenFormat(token)) notFound();

  const assessment = getStore().getAssessmentByToken(token);
  if (!assessment || !assessment.result) notFound();

  if (assessment.status !== "paid") {
    return (
      <main className="flex flex-1 flex-col justify-center pb-24">
        <h1 className="text-[length:var(--text-title)]">
          Existe mais informação nesta imagem do que parece.
        </h1>
        <GoldDivider className="my-8" />
        <p className="max-w-xl text-ink-muted">
          O diagnóstico completo estará disponível em breve. O checkout desta
          etapa está em preparação — você receberá o acesso pelo contato
          informado.
        </p>
        <div className="mt-10">
          <Link
            href={`/diagnostico/resultado/${token}`}
            className="inline-flex min-h-[48px] items-center justify-center border border-line px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent"
          >
            Voltar ao meu resultado
          </Link>
        </div>
      </main>
    );
  }

  // Renderização completa do relatório pago: Fase 4.
  return (
    <main className="flex-1 pb-24">
      <h1 className="text-[length:var(--text-title)]">Seu diagnóstico completo</h1>
      <GoldDivider className="my-8" />
      <p className="text-ink-muted">Relatório completo em construção (Fase 4).</p>
    </main>
  );
}
