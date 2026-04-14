import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./tests/setup.tsx"],
    // Only pick up files under tests/ — keeps e2e/ out of Vitest
    include: ["tests/**/*.test.{ts,tsx}"],
    // Per-file environment set via // @vitest-environment jsdom docblock
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
