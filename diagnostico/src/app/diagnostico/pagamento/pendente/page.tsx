import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default async function PendentePage({
  searchParams,
}: PageProps<"/diagnostico/pagamento/pendente">) {
  const { token } = await searchParams;
  const t = typeof token === "string" ? token : "";

  return (
    <main className="flex flex-1 flex-col justify-center pb-16 text-center">
      <h1 className="text-[length:var(--text-title)]">Pagamento em processamento</h1>
      <GoldDivider className="mx-auto my-8" />
      <p className="mx-auto max-w-md text-ink-muted">
        Assim que o pagamento for confirmado, seu diagnóstico completo será
        liberado automaticamente neste mesmo link. Guarde-o.
      </p>
      {t && (
        <div className="mt-10">
          <Link
            href={`/diagnostico/resultado/${t}`}
            className="inline-flex min-h-[48px] items-center justify-center border border-line px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent"
          >
            Voltar ao meu resultado
          </Link>
        </div>
      )}
    </main>
  );
}
