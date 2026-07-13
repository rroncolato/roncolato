import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoldDivider } from "@/components/ui/GoldDivider";

export const metadata = { title: "Política de Privacidade — Diagnóstico de Expressão" };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <BrandLogo />
      <h1 className="mt-10 text-[length:var(--text-title)]">Política de Privacidade</h1>
      <GoldDivider className="my-8" />
      <div className="space-y-6 text-sm leading-relaxed text-ink-muted">
        <p>
          O Diagnóstico de Expressão, do Estúdio Roncolato, coleta apenas os
          dados necessários para gerar sua análise: nome, contato, informações
          profissionais, respostas do questionário e a fotografia enviada.
        </p>
        <h2 className="font-display text-base text-ink">Finalidade</h2>
        <p>
          Seus dados são utilizados exclusivamente para gerar o diagnóstico,
          entregar o resultado e, com sua autorização, entrar em contato sobre
          ele. A fotografia é analisada por sistema de inteligência artificial
          para leitura de sinais visuais — sem reconhecimento facial e sem
          qualquer tentativa de identificar quem você é.
        </p>
        <h2 className="font-display text-base text-ink">Armazenamento</h2>
        <p>
          A fotografia fica em armazenamento privado, sem acesso público, com
          metadados removidos, pelo período de até 180 dias — depois disso é
          excluída. O envio da imagem para diagnóstico não autoriza seu uso
          publicitário: uso em portfólio depende de autorização separada e
          opcional.
        </p>
        <h2 className="font-display text-base text-ink">Seus direitos</h2>
        <p>
          Você pode solicitar a qualquer momento a exclusão da sua fotografia,
          do diagnóstico ou de todos os seus dados pela página{" "}
          <a href="/solicitar-exclusao" className="underline hover:text-ink">
            Solicitar exclusão
          </a>
          , conforme a Lei Geral de Proteção de Dados (LGPD).
        </p>
        <h2 className="font-display text-base text-ink">Contato</h2>
        <p>Dúvidas sobre privacidade: rodrigo@rroncolato.com.</p>
      </div>
    </main>
  );
}
