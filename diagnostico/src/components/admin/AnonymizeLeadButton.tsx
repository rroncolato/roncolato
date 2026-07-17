"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AnonymizeLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function anonymize() {
    if (!confirm("Confirma a anonimização deste lead? Esta ação não pode ser desfeita.")) return;
    setBusy(true);
    await fetch(`/api/admin/leads/${leadId}/anonymize`, { method: "POST" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={anonymize}
      disabled={busy}
      className="min-h-[44px] border border-error px-6 text-xs uppercase tracking-[0.15em] text-error hover:bg-error hover:text-primary disabled:opacity-50"
    >
      {busy ? "Processando..." : "Anonimizar lead"}
    </button>
  );
}
