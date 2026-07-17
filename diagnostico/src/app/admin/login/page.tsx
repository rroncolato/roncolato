import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { GoldDivider } from "@/components/ui/GoldDivider";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Estúdio Roncolato</p>
      <h1 className="mt-4 text-[length:var(--text-subtitle)]">Painel administrativo</h1>
      <GoldDivider className="my-8" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
