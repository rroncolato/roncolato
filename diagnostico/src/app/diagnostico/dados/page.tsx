import { LeadForm } from "@/components/diagnostic/LeadForm";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default function DadosPage() {
  return (
    <main className="flex-1 pb-16">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Passo 1 de 3</p>
      <h1 className="mt-4 text-[length:var(--text-title)]">Sobre você</h1>
      <GoldDivider className="my-8" />
      <LeadForm />
    </main>
  );
}
