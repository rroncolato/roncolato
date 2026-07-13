import { notFound } from "next/navigation";
import { isDemoMode, fullReportPriceBRL } from "@/lib/config";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { SimulatedCheckout } from "@/components/diagnostic/SimulatedCheckout";

/** Checkout simulado — existe apenas em DEMO_MODE. */
export default async function SimuladoPage({
  searchParams,
}: PageProps<"/diagnostico/pagamento/simulado">) {
  if (!isDemoMode) notFound();
  const { token } = await searchParams;
  if (typeof token !== "string") notFound();

  return (
    <main className="flex flex-1 flex-col justify-center pb-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Modo de demonstração</p>
      <h1 className="mt-4 text-[length:var(--text-title)]">Pagamento simulado</h1>
      <GoldDivider className="my-8" />
      <div className="border border-line bg-surface p-8">
        <p className="text-sm text-ink-muted">Diagnóstico de Expressão — Relatório Completo</p>
        <p className="mt-2 font-display text-3xl text-ink">{fullReportPriceBRL()}</p>
        <p className="mt-4 text-xs text-ink-muted">
          Nenhuma cobrança real. Este checkout simula o fluxo do Mercado Pago
          para testes internos.
        </p>
      </div>
      <div className="mt-8">
        <SimulatedCheckout token={token} />
      </div>
    </main>
  );
}
