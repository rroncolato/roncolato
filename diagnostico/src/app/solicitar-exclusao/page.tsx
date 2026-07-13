import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { DeletionRequestForm } from "@/components/diagnostic/DeletionRequestForm";

export const metadata = { title: "Solicitar exclusão — Diagnóstico de Expressão" };

export default function SolicitarExclusaoPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <BrandLogo />
      <h1 className="mt-10 text-[length:var(--text-title)]">Solicitar exclusão de dados</h1>
      <GoldDivider className="my-8" />
      <p className="text-sm text-ink-muted">
        Informe o e-mail utilizado no diagnóstico. Sua solicitação será
        registrada e atendida conforme a LGPD — fotografia, diagnóstico e dados
        pessoais serão excluídos ou anonimizados.
      </p>
      <div className="mt-8">
        <DeletionRequestForm />
      </div>
    </main>
  );
}
