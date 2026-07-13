"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SimulatedCheckout({ token }: { token: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(outcome: "approved" | "rejected") {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/dev/approve-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, outcome }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Falha na simulação.");
      setBusy(false);
      return;
    }
    router.push(
      outcome === "approved"
        ? `/diagnostico/pagamento/sucesso?token=${token}`
        : `/diagnostico/pagamento/falha?token=${token}`,
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button type="button" onClick={() => decide("approved")} disabled={busy}>
        Aprovar pagamento
      </Button>
      <Button type="button" variant="ghost" onClick={() => decide("rejected")} disabled={busy}>
        Simular falha
      </Button>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
