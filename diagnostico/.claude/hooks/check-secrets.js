#!/usr/bin/env node
/**
 * PreToolUse hook (Write/Edit): bloqueia inclusão evidente de segredos.
 * Exit 2 = bloqueia a operação. Nunca apaga ou modifica arquivos.
 */
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = input.tool_input?.file_path || "";
    // .env.local é o lugar legítimo de segredos locais — não bloquear.
    if (/\.env(\.|$)/.test(filePath)) process.exit(0);

    const content =
      (input.tool_input?.content || "") + (input.tool_input?.new_string || "");

    const patterns = [
      /sk-ant-[A-Za-z0-9-]{20,}/, // Anthropic
      /APP_USR-[0-9a-f-]{20,}/i, // Mercado Pago
      /eyJhbGciOi[A-Za-z0-9._-]{40,}/, // JWT (service role)
      /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
    ];
    for (const p of patterns) {
      if (p.test(content)) {
        console.error(
          "Bloqueado: possível segredo detectado. Use variáveis de ambiente (.env.local).",
        );
        process.exit(2);
      }
    }
    process.exit(0);
  } catch {
    process.exit(0); // hook nunca quebra o fluxo por erro próprio
  }
});
