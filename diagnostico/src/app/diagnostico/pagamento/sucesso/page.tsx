import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";

/**
 * Página de retorno do checkout. Informativa apenas —
 * a liberação real acontece via webhook/simulação no servidor.
 */
export default async function SucessoPage({
  searchParams,
}: PageProps<"/diagnostico/pagamento/sucesso">) {
  const { token } = await searchParams;
  const t = typeof token === "string" ? token : "";

  return (
    <main className="flex flex-1 flex-col justify-center pb-16 text-center">
      <h1 className="text-[length:var(--text-title)]">Pagamento confirmado</h1>
      <GoldDivider className="mx-auto my-8" />
      <p className="mx-auto max-w-md text-ink-muted">
        Seu diagnóstico completo está sendo liberado. A confirmação definitiva
        acontece em instantes.
      </p>
      {t && (
        <div className="mt-10">
          <Link
            href={`/diagnostico/completo/${t}`}
            className="inline-flex min-h-[48px] items-center justify-center bg-accent px-10 py-4 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors hover:bg-accent-hover"
          >
            Ver meu diagnóstico completo
          </Link>
        </div>
      )}
    </main>
  );
}
