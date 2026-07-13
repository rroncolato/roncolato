"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { leadSchema } from "@/lib/schemas/lead";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { captureUtm, setToken } from "@/lib/journey-client";

type FormValues = z.input<typeof leadSchema>;

export function LeadForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { consentMarketing: false },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, utm: captureUtm() }),
    });
    if (!res.ok) {
      setServerError("Não foi possível enviar seus dados. Tente novamente.");
      return;
    }
    const { token } = (await res.json()) as { token: string };
    setToken(token);
    router.push("/diagnostico/perguntas");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <TextField
        label="Nome completo"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="WhatsApp"
        type="tel"
        inputMode="tel"
        placeholder="(00) 00000-0000"
        autoComplete="tel"
        error={errors.whatsapp?.message}
        {...register("whatsapp")}
      />
      <TextField
        label="Empresa ou marca"
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />
      <TextField
        label="Cargo ou função"
        autoComplete="organization-title"
        error={errors.role?.message}
        {...register("role")}
      />
      <TextField
        label="Segmento de atuação"
        error={errors.segment?.message}
        {...register("segment")}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Instagram" optional {...register("instagram")} />
        <TextField label="LinkedIn" optional {...register("linkedin")} />
        <TextField label="Cidade" optional {...register("city")} />
        <TextField
          label="Como chegou até aqui?"
          optional
          {...register("contactOrigin")}
        />
      </div>

      <fieldset className="space-y-4 border-t border-line pt-6">
        <legend className="sr-only">Consentimentos</legend>
        <label className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
            {...register("consentContact")}
          />
          <span>
            Autorizo o contato do Estúdio Roncolato sobre meu diagnóstico.{" "}
            <span className="text-xs opacity-70">
              (necessário para receber o resultado)
            </span>
          </span>
        </label>
        {errors.consentContact && (
          <p role="alert" className="text-sm text-error">
            {errors.consentContact.message}
          </p>
        )}
        <label className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
            {...register("consentMarketing")}
          />
          <span>Aceito receber conteúdos sobre posicionamento de imagem. (opcional)</span>
        </label>
      </fieldset>

      {serverError && (
        <p role="alert" className="text-sm text-error">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Enviando..." : "Continuar"}
      </Button>
    </form>
  );
}
