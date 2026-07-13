"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function UpgradeButton({ token, label }: { token: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/assessments/${token}/checkout`, { method: "POST" });
    const data = (await res.json().catch(() => null)) as {
      checkoutUrl?: string;
      alreadyPaid?: boolean;
      error?: string;
    } | null;

    if (data?.alreadyPaid) {
      router.push(`/diagnostico/completo/${token}`);
      return;
    }
    if (!res.ok || !data?.checkoutUrl) {
      setError(data?.error ?? "Não foi possível iniciar o pagamento.");
      setLoading(false);
      return;
    }
    if (data.checkoutUrl.startsWith("/")) router.push(data.checkoutUrl);
    else window.location.href = data.checkoutUrl;
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={startCheckout} disabled={loading}>
        {loading ? "Preparando..." : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
