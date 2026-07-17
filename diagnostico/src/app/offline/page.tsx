import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <BrandLogo />
      <GoldDivider className="my-8" />
      <h1 className="text-[length:var(--text-subtitle)]">Você está sem conexão</h1>
      <p className="mt-4 text-ink-muted">
        Verifique sua internet e tente novamente. Seu progresso na jornada é
        salvo no seu navegador.
      </p>
    </main>
  );
}
