import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Testes rodam fora do runtime Next — neutraliza a guarda server-only.
      "server-only": path.resolve(__dirname, "src/test/server-only-stub.ts"),
    },
  },
});
