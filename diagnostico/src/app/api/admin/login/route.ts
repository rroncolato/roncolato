import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { validateAdminCredentials, createAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { rateLimit, clientKey } from "@/lib/ratelimit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit(clientKey(request, "admin-login"), {
    limit: 8,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 422 });
  }

  if (!validateAdminCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const token = createAdminSessionToken(parsed.data.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
