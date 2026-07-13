"use client";

import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export function DeletionRequestForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setSending(true);
    const res = await fetch("/api/deletion-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setSending(false);
    if (!res?.ok) {
      setError("Não foi possível registrar agora. Tente novamente ou escreva para rodrigo@rroncolato.com.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="border border-line bg-surface p-6 text-sm text-ink-muted">
        Solicitação registrada. Você receberá a confirmação da exclusão no
        e-mail informado.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <TextField
        label="E-mail utilizado no diagnóstico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
      />
      <Button type="submit" disabled={sending}>
        {sending ? "Enviando..." : "Solicitar exclusão"}
      </Button>
    </form>
  );
}
