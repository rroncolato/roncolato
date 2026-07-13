import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { LandingTracker } from "@/components/diagnostic/LandingTracker";

export default function LandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:py-16">
      <LandingTracker />
      <header>
        <BrandLogo />
      </header>

      <section className="flex flex-1 flex-col justify-center py-20 sm:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          Diagnóstico de Expressão
        </p>
        <h1 className="mt-6 max-w-2xl text-[length:var(--text-hero)] leading-[1.1]">
          Sua foto representa o profissional que você é hoje?
        </h1>
        <GoldDivider className="my-10" />
        <p className="max-w-xl text-lg text-ink-muted">
          Envie sua foto de perfil e descubra o que ela comunica sobre sua
          expressão, autoridade e posicionamento.
        </p>

        <div className="mt-12">
          <Link
            href="/diagnostico"
            className="inline-flex min-h-[48px] items-center justify-center bg-accent px-10 py-4 font-display text-sm uppercase tracking-[0.12em] text-primary transition-colors duration-300 hover:bg-accent-hover"
          >
            Analisar minha expressão
          </Link>
        </div>

        <p className="mt-8 max-w-md text-sm text-ink-muted/80">
          Sua imagem será utilizada exclusivamente para gerar o diagnóstico e
          não será publicada.
        </p>
      </section>

      <section className="border-t border-line py-16">
        <p className="max-w-2xl font-display text-[length:var(--text-subtitle)] leading-relaxed text-ink">
          Antes de você falar, sua imagem já começou a posicionar você.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            ["01", "Responda", "Dez perguntas sobre seu momento e posicionamento desejado."],
            ["02", "Envie sua foto", "A imagem que o mercado vê primeiro — analisada em seis pilares."],
            ["03", "Receba a leitura", "O que sua fotografia comunica antes mesmo de você falar."],
          ].map(([num, title, text]) => (
            <div key={num}>
              <span className="font-display text-sm text-accent">{num}</span>
              <h2 className="mt-3 font-display text-lg tracking-wide">{title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-8 text-xs text-ink-muted">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© Estúdio Roncolato</span>
          <nav className="flex gap-6">
            <Link href="/privacidade" className="hover:text-ink">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-ink">
              Termos
            </Link>
            <Link href="/solicitar-exclusao" className="hover:text-ink">
              Solicitar exclusão
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
