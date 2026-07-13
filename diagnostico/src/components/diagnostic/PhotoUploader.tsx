"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getToken, sendEvent } from "@/lib/journey-client";

const ACCEPT = "image/jpeg,image/png,image/webp";

export function PhotoUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [consentAnalysis, setConsentAnalysis] = useState(false);
  const [consentPortfolio, setConsentPortfolio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/diagnostico/dados");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function onSelect(selected: File | undefined) {
    setError(null);
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    sendEvent("photo_selected", getToken());
  }

  async function upload() {
    if (!file || !consentAnalysis) return;
    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("photo", file);
    form.append("consentAnalysis", String(consentAnalysis));
    form.append("consentPortfolio", String(consentPortfolio));

    const res = await fetch(`/api/assessments/${getToken()}/photo`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Não foi possível enviar a imagem. Tente novamente.");
      setUploading(false);
      return;
    }
    router.push("/diagnostico/processando");
  }

  return (
    <div className="space-y-8">
      <p className="text-ink-muted">
        Envie a fotografia de perfil que você usa hoje — a mesma que seu
        mercado vê primeiro.
      </p>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-label="Selecionar fotografia"
          onChange={(e) => onSelect(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 border border-dashed border-line bg-surface/50 px-6 py-10 text-ink-muted transition-colors hover:border-accent"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Pré-visualização da fotografia selecionada"
              className="max-h-64 w-auto"
            />
          ) : (
            <>
              <span className="font-display text-sm uppercase tracking-[0.15em]">
                Selecionar fotografia
              </span>
              <span className="text-xs">JPG, PNG ou WebP · até 10 MB · mínimo 400 × 400 px</span>
            </>
          )}
        </button>
        {file && (
          <p className="mt-2 text-xs text-ink-muted">
            {file.name} — toque para trocar
          </p>
        )}
      </div>

      <fieldset className="space-y-4 border-t border-line pt-6">
        <legend className="sr-only">Consentimentos sobre a imagem</legend>
        <label className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={consentAnalysis}
            onChange={(e) => setConsentAnalysis(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            Autorizo a análise desta imagem para gerar meu diagnóstico. Ela será
            armazenada de forma privada e não será publicada.{" "}
            <Link href="/privacidade" className="underline hover:text-ink" target="_blank">
              Política de privacidade
            </Link>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={consentPortfolio}
            onChange={(e) => setConsentPortfolio(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            Autorizo o uso futuro em portfólio/estudos de caso. (opcional — o
            diagnóstico não depende disso)
          </span>
        </label>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={upload}
        disabled={!file || !consentAnalysis || uploading}
        className="w-full sm:w-auto"
      >
        {uploading ? "Enviando..." : "Analisar minha expressão"}
      </Button>
    </div>
  );
}
