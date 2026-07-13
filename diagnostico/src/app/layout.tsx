import type { Metadata, Viewport } from "next";
import { Jost, Libre_Franklin } from "next/font/google";
import "./globals.css";

/**
 * Tipografia:
 * - Títulos: Nord (licenciada). Arquivo ausente no momento — fallback Jost,
 *   geométrica de características próximas. Para trocar: importar Nord via
 *   next/font/local com variable "--font-nord" e remover o fallback.
 * - Texto: Libre Franklin via variable "--font-libre".
 */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const libre = Libre_Franklin({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Diagnóstico de Expressão — Estúdio Roncolato",
  description:
    "Envie sua foto de perfil e descubra o que ela comunica sobre sua expressão, autoridade e posicionamento.",
};

export const viewport: Viewport = {
  themeColor: "#1B1B1B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${libre.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
