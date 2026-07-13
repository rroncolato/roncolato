#!/usr/bin/env node
/**
 * PreToolUse hook (Bash): impede git add/commit de arquivos .env.
 * Exit 2 = bloqueia. Não executa nada destrutivo.
 */
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const cmd = input.tool_input?.command || "";
    const isGitWrite = /\bgit\s+(add|commit|stage)\b/.test(cmd);
    const touchesEnv = /\.env(\.local|\.production|\.development)?\b/.test(cmd);
    const isExample = /\.env\.example\b/.test(cmd);
    if (isGitWrite && touchesEnv && !isExample) {
      console.error("Bloqueado: tentativa de adicionar arquivo .env ao git.");
      process.exit(2);
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
