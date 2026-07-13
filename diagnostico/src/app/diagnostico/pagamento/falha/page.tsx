import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default async function FalhaPage({
  searchParams,
}: PageProps<"/diagnostico/pagamento/falha">) {
  const { token } = await searchParams;
  const t = typeof token === "string" ? token : "";

  return (
    <main className="flex flex-1 flex-col justify-center pb-16 text-center">
      <h1 className="text-[length:var(--text-title)]">O pagamento não foi concluído</h1>
      <GoldDivider className="mx-auto my-8" />
      <p className="mx-auto max-w-md text-ink-muted">
        Nada foi cobrado. Quando quiser, você pode tentar novamente a partir do
        seu resultado.
      </p>
      {t && (
        <div className="mt-10">
          <Link
            href={`/diagnostico/resultado/${t}`}
            className="inline-flex min-h-[48px] items-center justify-center bg-accent px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors hover:bg-accent-hover"
          >
            Voltar ao meu resultado
          </Link>
        </div>
      )}
    </main>
  );
}
