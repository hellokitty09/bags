import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "@creator-intel/shared": resolve(__dirname, "../../packages/shared/src"),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
