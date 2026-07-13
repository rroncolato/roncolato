import { PhotoUploader } from "@/components/diagnostic/PhotoUploader";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default function FotoPage() {
  return (
    <main className="flex-1 pb-16">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Passo 3 de 3</p>
      <h1 className="mt-4 text-[length:var(--text-title)]">Sua fotografia</h1>
      <GoldDivider className="my-8" />
      <PhotoUploader />
    </main>
  );
}
