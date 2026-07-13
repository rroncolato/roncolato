"use client";

import { sendEvent } from "@/lib/journey-client";

const WHATSAPP_MESSAGE =
  "Olá, Rodrigo. Fiz meu Diagnóstico de Expressão e gostaria de conversar sobre meu posicionamento de imagem.";

export function BookingCTA({
  token,
  bookingUrl,
  whatsappNumber,
}: {
  token: string;
  bookingUrl: string;
  whatsappNumber: string;
}) {
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendEvent("booking_clicked", token)}
          className="inline-flex min-h-[48px] items-center justify-center bg-accent px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors hover:bg-accent-hover"
        >
          Agendar minha Sessão Estratégica
        </a>
      )}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendEvent("whatsapp_clicked", token)}
          className="inline-flex min-h-[48px] items-center justify-center border border-line px-8 py-3 font-display text-sm uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent"
        >
          Conversar no WhatsApp
        </a>
      )}
    </div>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-xs uppercase tracking-[0.15em] text-ink-muted underline-offset-4 hover:text-ink hover:underline print:hidden"
    >
      Salvar como PDF / imprimir
    </button>
  );
}
