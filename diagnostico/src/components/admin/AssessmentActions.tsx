"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AssessmentActions({
  assessmentId,
  hasImage,
  status,
}: {
  assessmentId: string;
  hasImage: boolean;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: string, confirmMessage?: string) {
    if (confirmMessage && !confirm(confirmMessage)) return;
    setBusy(action);
    await fetch(`/api/admin/assessments/${assessmentId}/${action}`, { method: "POST" });
    router.refresh();
    setBusy(null);
  }

  const buttonClass =
    "min-h-[44px] border border-line px-6 text-xs uppercase tracking-[0.15em] text-ink hover:border-accent disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={() => run("reprocess")}
        disabled={busy !== null || !hasImage}
        className={buttonClass}
      >
        {busy === "reprocess" ? "Reprocessando..." : "Reprocessar análise"}
      </button>
      {status !== "paid" && (
        <button
          type="button"
          onClick={() =>
            run("release", "Liberar o relatório completo manualmente, sem pagamento?")
          }
          disabled={busy !== null}
          className={buttonClass}
        >
          Liberar manualmente
        </button>
      )}
      {hasImage && (
        <button
          type="button"
          onClick={() => run("delete-photo", "Excluir a fotografia deste diagnóstico?")}
          disabled={busy !== null}
          className={`${buttonClass} border-error text-error hover:bg-error hover:text-primary`}
        >
          Excluir fotografia
        </button>
      )}
      <button
        type="button"
        onClick={() => run("delete", "Excluir este diagnóstico? Esta ação não pode ser desfeita.")}
        disabled={busy !== null}
        className={`${buttonClass} border-error text-error hover:bg-error hover:text-primary`}
      >
        Excluir diagnóstico
      </button>
    </div>
  );
}
