import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { getStore } from "@/lib/db";

/**
 * Serve a fotografia do assessment para o admin autenticado.
 * Em produção isto vira uma URL assinada de curta duração no bucket privado;
 * aqui, o próprio middleware de admin já protege o acesso.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/admin/assessments/[id]/photo">) {
  const { id } = await ctx.params;
  const store = getStore();
  const image = store.getImageByAssessment(id);
  if (!image) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

  try {
    const buffer = readFileSync(image.storagePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo indisponível." }, { status: 404 });
  }
}
